const API_URL = 'http://46.202.150.164:8080';
const API_KEY = 'mude-me';

interface WhatsAppResponse {
  status: string;
  message: string;
  error?: string;
}

export class WhatsAppService {
  private static formatPhoneNumber(number: string): string {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;
  }

  public static async sendMessage(
    instanceName: string,
    contactNumber: string,
    selectedText: string
  ): Promise<WhatsAppResponse> {
    const options = {
      method: 'POST',
      headers: {
        apikey: API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: this.formatPhoneNumber(contactNumber),
        options: {
          delay: 3000,
          presence: 'composing',
        },
        textMessage: {
          text: selectedText,
        },
      }),
    };

    const response = await fetch(`${API_URL}/message/sendText/${instanceName}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send message');
    }

    return response.json();
  }

  public static async fetchInstances() {
    try {
      const response = await fetch(`${API_URL}/instance/fetchInstances`, {
        headers: { apikey: API_KEY },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching instances:', error);
      throw error;
    }
  }
}
