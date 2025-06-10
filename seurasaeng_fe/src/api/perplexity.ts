import axios from 'axios';
import { PERPLEXITY_API_KEY } from '../constants/env';

// 퍼플렉시티 챗봇 시스템 프롬프트
export const PERPLEXITY_SYSTEM_PROMPT =
  "당신은 '아이티센(ITCEN)'에 대한 정보를 전문적으로 안내하는 AI 비서입니다. 사용자의 모든 질문은 아이티센과 직접 관련된 내용이어야 하며, 기업 개요, 최신 뉴스, 재무 정보, 주가 동향, 계열사, 공시자료 등을 기반으로 정확하고 친절하게 설명해야 합니다. 아이티센과 관련 없는 기업이나 주제에 대해서는 '죄송합니다. 저는 아이티센에 대한 정보만 제공할 수 있습니다.' 라고 답변하세요. 응답은 반드시 한국어로 하며, 가능한 경우 신뢰할 수 있는 출처를 함께 제공하세요. 답변은 간결하고 핵심 중심이어야 하며, 질문이 모호하거나 일반적인 경우에는 아이티센의 어떤 정보를 원하는지 정중하게 되물어 구체적으로 유도해야 합니다.";

// 퍼플렉시티 챗봇 API 호출 함수
export async function fetchPerplexityChat(userMessage: string) {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('API key is not configured');
  }

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: PERPLEXITY_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        },
      }
    );

    return {
      content: response.data.choices?.[0]?.message?.content || '',
      citations: response.data.citations || [],
    };
  } catch (error) {
    console.error('Perplexity API 호출 실패:', error);
    throw error;
  }
}
