const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY
})

function ruleCategory(title){

  const text = title.toLowerCase()

  if(
    text.includes("uber") ||
    text.includes("rapido") ||
    text.includes("ola") ||
    text.includes("taxi") ||
    text.includes("bus") ||
    text.includes("train") ||
    text.includes("metro")
  ){
    return "Travel"
  }

  if(
    text.includes("pizza") ||
    text.includes("burger") ||
    text.includes("restaurant") ||
    text.includes("food") ||
    text.includes("cafe") ||
    text.includes("coffee")
  ){
    return "Food"
  }

  if(
    text.includes("amazon") ||
    text.includes("flipkart") ||
    text.includes("shopping") ||
    text.includes("mall")
  ){
    return "Shopping"
  }

  if(
    text.includes("electricity") ||
    text.includes("rent") ||
    text.includes("bill") ||
    text.includes("wifi") ||
    text.includes("recharge")
  ){
    return "Bills"
  }

  return "Other"
}


async function getCategory(title){

  try{

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Categorize this expense: ${title}. Only return one category: Food, Travel, Shopping, Bills, Other`
        }
      ]
    })

    const aiCategory = response.choices[0].message.content.trim()

    return aiCategory

  }catch(error){

    console.log("AI FAILED → Using Rule System")

    return ruleCategory(title)

  }

}

module.exports = getCategory