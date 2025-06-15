
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Checking for pending notifications...");
    const currentTime = new Date().toISOString();
    console.log("Current time:", currentTime);

    // Get all pending notifications that are due
    const { data: notifications, error: notificationsError } = await supabase
      .from("notifications")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_time", currentTime);

    if (notificationsError) {
      console.error("Error fetching notifications:", notificationsError);
      throw notificationsError;
    }

    console.log(`Found ${notifications?.length || 0} pending notifications`);
    
    if (notifications && notifications.length > 0) {
      console.log("Notifications to process:", notifications.map(n => ({
        id: n.id,
        type: n.type,
        scheduled_time: n.scheduled_time,
        reference_id: n.reference_id
      })));
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending notifications", checked_at: currentTime }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const notification of notifications) {
      try {
        console.log(`Processing notification ${notification.id} of type ${notification.type}`);
        
        let emailContent = "";
        let subject = "";

        // Get user profile for email
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", notification.user_id)
          .single();

        const userName = profile?.full_name || "User";

        if (notification.type === "prescription") {
          // Get prescription details
          const { data: prescription } = await supabase
            .from("prescriptions")
            .select("*")
            .eq("id", notification.reference_id)
            .single();

          if (prescription) {
            subject = `Medication Reminder: ${prescription.medication_name}`;
            emailContent = `
              <h2>Medication Reminder</h2>
              <p>Hello ${userName},</p>
              <p>It's time to take your medication:</p>
              <ul>
                <li><strong>Medication:</strong> ${prescription.medication_name}</li>
                <li><strong>Dosage:</strong> ${prescription.dosage}</li>
                <li><strong>Frequency:</strong> ${prescription.frequency}</li>
                ${prescription.instructions ? `<li><strong>Instructions:</strong> ${prescription.instructions}</li>` : ''}
              </ul>
              <p>Please take your medication as prescribed by your doctor.</p>
              <p>Best regards,<br>Your Health App</p>
            `;
          }
        } else if (notification.type === "reminder") {
          // Get reminder details
          const { data: reminder } = await supabase
            .from("reminders")
            .select("*")
            .eq("id", notification.reference_id)
            .single();

          if (reminder) {
            subject = `Reminder: ${reminder.title}`;
            emailContent = `
              <h2>Health Reminder</h2>
              <p>Hello ${userName},</p>
              <p>You have a reminder:</p>
              <ul>
                <li><strong>Title:</strong> ${reminder.title}</li>
                <li><strong>Type:</strong> ${reminder.reminder_type}</li>
                ${reminder.description ? `<li><strong>Description:</strong> ${reminder.description}</li>` : ''}
                <li><strong>Frequency:</strong> ${reminder.frequency}</li>
              </ul>
              <p>Don't forget to complete this task!</p>
              <p>Best regards,<br>Your Health App</p>
            `;
          }
        }

        // Get user email from auth.users (we'll need to use the service role for this)
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(notification.user_id);
        
        if (authError || !authUser.user?.email) {
          console.error("Error getting user email:", authError);
          continue;
        }

        console.log(`Sending email to: ${authUser.user.email}`);

        // Send email notification if method includes email
        if (notification.notification_method === "email" || notification.notification_method === "both") {
          const emailResponse = await resend.emails.send({
            from: "Health App <onboarding@resend.dev>",
            to: [authUser.user.email],
            subject: subject,
            html: emailContent,
          });

          console.log("Email sent:", emailResponse);
        }

        // Update notification status to sent
        const { error: updateError } = await supabase
          .from("notifications")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", notification.id);

        if (updateError) {
          console.error("Error updating notification status:", updateError);
        }

        results.push({
          id: notification.id,
          status: "sent",
          type: notification.type,
        });

      } catch (error) {
        console.error(`Error processing notification ${notification.id}:`, error);
        
        // Mark notification as failed
        await supabase
          .from("notifications")
          .update({
            status: "failed",
            sent_at: new Date().toISOString(),
          })
          .eq("id", notification.id);

        results.push({
          id: notification.id,
          status: "failed",
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} notifications`,
        results,
        checked_at: currentTime,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
