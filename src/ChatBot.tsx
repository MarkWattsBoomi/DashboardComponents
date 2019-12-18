import { FlowComponent } from 'flow-component-model';
import * as React from 'react';
import './css/ChatBot.css';

declare const manywho: any;

class ChatMessage {
    isBot: boolean = false;
    date: Date = null;
    message: string = '';

    constructor(isBot: boolean, message: string) {
        this.isBot = isBot;
        this.message = message;
        this.date = new Date();
    }
}
class ChatBot extends FlowComponent {

    messages: ChatMessage[] = [];
    messageInput: any;

    constructor(props: any) {
        super(props);

        this.userMessage = this.userMessage.bind(this);
        this.createResponse = this.createResponse.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    render() {

        const messageList: any = [];

        for (const msg of this.messages) {
            let className: string = 'chat-bot-user-message';
            if (msg.isBot) {
                className = 'chat-bot-bot-message';
            }

            messageList.push(
                <div className={className}>
                    <span>{msg.date.toLocaleTimeString()}</span>
                    <span>   -   </span>
                    <span>{msg.message}</span>
                </div>,
            );
        }

        return (
        <div className="chat-bot">
            <div className="chat-bot-inner">
                <div className="chat-bot-message-area">
                    <div id="msgfrm" className="chat-bot-message-frame">
                        {messageList}
                    </div>
                </div>
                <div className="chat-bot-input-area">
                    <input
                        ref={(e) => {this.messageInput = e; }}
                        className="chat-bot-input-area-input"
                        type="text"
                        onKeyDown={(e) => {this.keyDown(e); }}
                    ></input>
                    <button title="Send" onClick={(e) => {this.userMessage(e); }}>Submit</button>
                </div>
            </div>
        </div>
        );
    }

    keyDown(e: any) {
        if (e.key === 'Enter') {
            this.userMessage(e);
        }
    }
    userMessage(e: any) {
        const msg: string = this.messageInput.value;
        this.messages.push(new ChatMessage(false, msg));
        this.messageInput.value = '';
        this.forceUpdate();
        this.scrollBottom();
        this.createResponse(msg);
    }

    scrollBottom() {
        const objDiv = document.getElementById('msgfrm');
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    createResponse(message: string) {
        let response: string;
        switch (true) {
            case message.indexOf('morning') >= 0:
            case message.indexOf('hello') >= 0:
            case message.indexOf('hi') >= 0:
                response = 'Good morning to you too';
                break;

            case message.indexOf('ill') >= 0:
            case message.indexOf('sick') >= 0:
            case message.indexOf('poorly') >= 0:
            case message.indexOf('awful') >= 0:
                response = 'Sorry to hear that, how exactly are you feeling unwell?';
                break;

            default:
                response = 'I\'m sorry, i\'m just a simple bot without propper training.  I don\'t know what you mean.';
                break;

        }
        this.messages.push(new ChatMessage(true, response));
        this.forceUpdate();
        this.scrollBottom();
    }
}

manywho.component.register('ChatBot', ChatBot);

export default ChatBot;
