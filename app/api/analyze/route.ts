import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in the environment variables");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      console.error("No image provided in the request");
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const result = await model.generateContent([
      "Analyze this image and provide a name and description for the main object or scene. Format your response as JSON with 'name' and 'description' fields.",
      {
        inlineData: {
          data: base64Image,
          mimeType: image.type,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    let analysisResult;
    try {
      // Attempt to parse the response as JSON
      analysisResult = JSON.parse(text);
    } catch (parseError) {
      // If parsing fails, attempt to extract name and description from the text
      const nameMatch = text.match(/"name"\s*:\s*"([^"]+)"/);
      const descriptionMatch = text.match(/"description"\s*:\s*"([^"]+)"/);
      analysisResult = {
        name: nameMatch ? nameMatch[1] : "Unnamed Object",
        description: descriptionMatch ? descriptionMatch[1] : text.trim(),
      };
    }

    // Ensure we have both name and description
    if (!analysisResult.name) analysisResult.name = "Unnamed Object";
    if (!analysisResult.description)
      analysisResult.description = "No description provided";

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
