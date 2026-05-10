import Anthropic from '@anthropic-ai/sdk';

const PROMPT = `This is an Ontario OHIP health card. Extract the following fields and return ONLY a JSON object with no other text:
{
  "firstName": "",
  "lastName": "",
  "dateOfBirth": "YYYY-MM-DD",
  "healthCardNumber": ""
}
If you cannot clearly read a field, return null for that field. If this is not a health card, return null.`;

export interface HealthCardData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  healthCardNumber: string;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export async function parseHealthCard(
  base64Image: string,
): Promise<HealthCardData | null> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('EXPO_PUBLIC_ANTHROPIC_API_KEY not set');
    return null;
  }

  const client = new Anthropic({ apiKey });

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: PROMPT,
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.error('parseHealthCard request failed', err);
    return null;
  }

  const block = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');
  if (!block) return null;

  const parsed = extractJson(block.text);
  if (!parsed || typeof parsed !== 'object') return null;

  const obj = parsed as Record<string, unknown>;
  const { firstName, lastName, dateOfBirth, healthCardNumber } = obj;

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof dateOfBirth !== 'string' ||
    typeof healthCardNumber !== 'string'
  ) {
    return null;
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    dateOfBirth: dob,
    healthCardNumber: healthCardNumber.trim(),
  };
}
