import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  isOpen = false;
  userInput = '';
  messages: { text: string; isUser: boolean }[] = [
    { text: '¡Hola! Soy el asistente de City Guardian. ¿En qué puedo ayudarte?', isUser: false }
  ];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ text: this.userInput, isUser: true });
      this.processUserMessage(this.userInput);
      this.userInput = '';
    }
  }

  private processUserMessage(message: string) {
    setTimeout(() => {
      const response = this.getBotResponse(message);
      this.messages.push({ text: response, isUser: false });
    }, 1000);
  }

  private getBotResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas')) {
      return '¡Hola! ¿En qué puedo ayudarte hoy?';
    }
    
    if (lowerMessage.includes('reporte') || lowerMessage.includes('denuncia')) {
      return 'Para crear un reporte, ve a la sección "Reporte" en el menú principal.';
    }
    
    if (lowerMessage.includes('mapa')) {
      return 'El mapa te permite ver todos los reportes activos en la ciudad. Puedes acceder a él desde el menú principal.';
    }
    
    return 'Lo siento, no entiendo tu pregunta. ¿Podrías reformularla?';
  }
} 