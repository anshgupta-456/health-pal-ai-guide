
export async function askHealthAssistant(messages: { role: "user" | "assistant"; content: string }[]) {
  const res = await fetch(
    "https://nknhollhzgdxmdytcwny.functions.supabase.co/ai-health-assistant",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    }
  );
  if (!res.ok) throw new Error((await res.json()).error ?? "Failed to ask assistant");
  return (await res.json()).reply as string;
}
