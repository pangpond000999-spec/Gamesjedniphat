
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ "AIzaSyAKZG2968cpUIFR9bOOjqr9YCfuD87rgcE" });

const LOCAL_QUESTION_BANK: Question[] = [
  { id: 'l1', text: 'ถ้า A = {1, 2, 3, 4} และ B = {3, 4, 5, 6} แล้ว A ∩ B คือข้อใด?', options: ['{3, 4}', '{1, 2, 5, 6}', '{1, 2, 3, 4, 5, 6}'], correctIndex: 0 },
  { id: 'l2', text: 'ถ้า A = {a, b, c} แล้วจำนวนสับเซตทั้งหมดของ A คือเท่าใด?', options: ['3', '6', '8'], correctIndex: 2 },
  { id: 'l3', text: 'เซตว่าง (∅) เป็นสับเซตของเซตใดบ้าง?', options: ['เฉพาะเซตว่างเอง', 'ทุกเซต', 'เซตที่มีสมาชิกเท่านั้น'], correctIndex: 1 },
  { id: 'l4', text: 'ถ้า n(A) = 10, n(B) = 15 และ n(A ∩ B) = 5 แล้ว n(A ∪ B) คือเท่าใด?', options: ['20', '25', '30'], correctIndex: 0 },
  { id: 'l5', text: 'กำหนด A = {x | x เป็นจำนวนเต็มบวกที่น้อยกว่า 5} เขียนแบบแจกแจงสมาชิกได้ตามข้อใด?', options: ['{1, 2, 3, 4, 5}', '{1, 2, 3, 4}', '{0, 1, 2, 3, 4}'], correctIndex: 1 },
  { id: 'l6', text: 'A - B หมายถึงข้อใด?', options: ['สมาชิกที่อยู่ใน A แต่ไม่อยู่ใน B', 'สมาชิกที่อยู่ใน B แต่ไม่อยู่ใน A', 'สมาชิกที่ไม่อยู่ทั้ง A และ B'], correctIndex: 0 },
  { id: 'l7', text: 'ถ้า A ⊂ B แล้ว A ∩ B เท่ากับข้อใด?', options: ['A', 'B', '∅'], correctIndex: 0 },
  { id: 'l8', text: 'เพาเวอร์เซตของ A คือเซตของอะไร?', options: ['สมาชิกของ A ทั้งหมด', 'สับเซตทั้งหมดของ A', 'เอกภพสัมพัทธ์'], correctIndex: 1 },
  { id: 'l9', text: 'สัญลักษณ์ A\' (คอมพลีเมนต์ของ A) หมายถึงข้อใด?', options: ['สมาชิกที่อยู่ใน A', 'สมาชิกที่อยู่ใน U แต่ไม่อยู่ใน A', 'สมาชิกที่ไม่อยู่ใน U'], correctIndex: 1 },
  { id: 'l10', text: 'ถ้า A = {1, {2, 3}} ข้อใดกล่าวถูกต้อง?', options: ['2 ∈ A', '{2, 3} ∈ A', '{2, 3} ⊂ A'], correctIndex: 1 },
  { id: 'l11', text: 'ถ้า n(P(A)) = 32 แล้ว n(A) มีค่าเท่าใด?', options: ['4', '5', '6'], correctIndex: 1 },
  { id: 'l12', text: 'กำหนด U = {1, 2, 3, 4, 5} และ A = {1, 3, 5} แล้ว A\' คือข้อใด?', options: ['{2, 4}', '{1, 3, 5}', '∅'], correctIndex: 0 },
  { id: 'l13', text: 'เซต {x | x² = 4 และ x เป็นจำนวนคี่} เป็นเซตชนิดใด?', options: ['เซตจำกัด', 'เซตอนันต์', 'เซตว่าง'], correctIndex: 2 },
  { id: 'l14', text: 'ถ้า A = {1, 2} และ B = {1, 2, 3} ข้อใดผิด?', options: ['A ⊂ B', 'A ∈ B', 'A ∪ B = B'], correctIndex: 1 },
  { id: 'l15', text: 'จำนวนสับเซตแท้ของเซตที่มีสมาชิก 4 ตัวคือเท่าใด?', options: ['14', '15', '16'], correctIndex: 1 },
  { id: 'l16', text: 'A ∪ ∅ เท่ากับข้อใด?', options: ['A', '∅', 'U'], correctIndex: 0 },
  { id: 'l17', text: 'ถ้า n(A) = 20, n(A ∪ B) = 35 และ n(B) = 25 แล้ว n(A ∩ B) คือเท่าใด?', options: ['5', '10', '15'], correctIndex: 1 },
  { id: 'l18', text: 'ข้อใดคือเซตที่เท่ากับ {2, 4, 6}?', options: ['{x | x เป็นเลขคู่}', '{x | x เป็นเลขคู่บวกที่น้อยกว่า 7}', '{x | x เป็นเลขคู่ที่หาร 12 ลงตัว}'], correctIndex: 1 },
  { id: 'l19', text: 'ถ้า A ∩ B = ∅ แสดงว่า?', options: ['A และ B ไม่มีสมาชิกร่วมกัน', 'A เป็นเซตว่าง', 'B เป็นเซตว่าง'], correctIndex: 0 },
  { id: 'l20', text: 'สับเซตของ {∅} มีกี่เซต?', options: ['1', '2', '4'], correctIndex: 1 },
  { id: 'l21', text: 'ถ้า A = {1, 2, 3} และ B = {2, 3, 4} แล้ว (A ∪ B) - (A ∩ B) คือข้อใด?', options: ['{1, 4}', '{2, 3}', '{1, 2, 3, 4}'], correctIndex: 0 },
  { id: 'l22', text: 'กำหนด A = {x | x เป็นตัวอักษรในคำว่า "MATHEMATICS"} n(A) เท่ากับเท่าใด?', options: ['11', '8', '7'], correctIndex: 1 },
  { id: 'l23', text: 'คอมพลีเมนต์ของเอกภพสัมพัทธ์ (U\') คือข้อใด?', options: ['U', '∅', 'เซตของสมาชิกที่เหลือ'], correctIndex: 1 },
  { id: 'l24', text: 'ถ้า n(A-B) = 10, n(B-A) = 12 และ n(A ∩ B) = 3 แล้ว n(A ∪ B) คือข้อใด?', options: ['22', '25', '28'], correctIndex: 1 },
  { id: 'l25', text: 'เซต {1, 2, 3, ...} เป็นเซตชนิดใด?', options: ['เซตจำกัด', 'เซตอนันต์', 'เซตว่าง'], correctIndex: 1 },
  { id: 'l26', text: 'ถ้า A = {x | x เป็นจำนวนเฉพาะที่น้อยกว่า 10} แล้ว A คือข้อใด?', options: ['{1, 2, 3, 5, 7}', '{2, 3, 5, 7}', '{3, 5, 7, 9}'], correctIndex: 1 },
  { id: 'l27', text: 'A ∩ A\' เท่ากับข้อใด?', options: ['A', 'U', '∅'], correctIndex: 2 },
  { id: 'l28', text: 'จำนวนสมาชิกของ P(P(∅)) คือเท่าใด?', options: ['1', '2', '4'], correctIndex: 1 },
  { id: 'l29', text: 'ถ้า A ⊂ B และ B ⊂ C แล้วข้อใดถูก?', options: ['A ⊂ C', 'C ⊂ A', 'A = C'], correctIndex: 0 },
  { id: 'l30', text: 'ข้อใดเป็นเซตว่าง?', options: ['{0}', '{∅}', '{x | x ≠ x}'], correctIndex: 2 }
];

export async function fetchSetTheoryQuestions(): Promise<Question[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: 'Generate 20 unique and challenging math questions about Set Theory (เซต) for Thai high school grade 10. Include topics: power sets, complex operations (A ∪ B)\', n(A ∪ B ∪ C), and word problems. Each question must have exactly 3 options.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER }
            },
            required: ['text', 'options', 'correctIndex']
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    if (data.length > 0) {
      return data.map((q: any, index: number) => ({ ...q, id: `api-${index}-${Date.now()}` }));
    }
    throw new Error("Empty API response");
  } catch (error) {
    console.error("Error fetching questions, using expanded local bank:", error);
    // Return a shuffled slice of the local question bank
    return [...LOCAL_QUESTION_BANK]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);
  }
}
