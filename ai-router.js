export function selectModel(task) {

  if(task.includes("fix") || task.includes("bug"))
    return "qwen2.5-coder-32b"

  if(task.includes("generate") || task.includes("create"))
    return "deepseek-coder-33b"

  if(task.includes("analyze"))
    return "deepseek-r1"

  if(task.includes("chat"))
    return "gemini-2.5-flash"

  return "ministral-8b"
}