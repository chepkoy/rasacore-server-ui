var chatTemp = `
    <div class="chat-interface">
        <div class="body">
            <div class="close-chat text-right">
                <a href="javascript:;" @click="closeChat()">
                    <i class="fa fa-times"></i>
                </a>
            </div>
            <div class="response">
                <pre>{{ response }}</pre>
            </div>
        </div>
        <div class="divider"></div>
        <div class="action">
            <div class="send-action">
                <div class="row" v-if="next_action != 'action_listen'">
                    <div class="pull-left">
                        Bot expected action <strong>{{next_action}}</strong>
                    </div>
                    <div class="pull-right">
                        <button class="btn btn-default" @click="sendBotResponse()">
                            Perform <i class="fa fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
            <form method="post" action="javascript:;" @submit="sendMessage()">
                <div class="input-group send-text">
                    <input type="text" class="form-control" :disabled="next_action != 'action_listen'" v-model="message" placeholder="User response"> 
                    <span class="input-group-btn">
                        <button class="btn btn-primary" :disabled="next_action != 'action_listen'" type="button" @click="sendMessage()">Send</button>
                    </span>
                </div>
            </form>
        </div>
    </div>
`;

Vue.component('chat', {
    template: chatTemp,
    props: ['show'],
    data: function() {
        return {
            message: '',
            response: '',
            next_action: 'action_listen'
        }
    },
    methods: {
        closeChat: function() {
            this.$emit('update:show', false);
        },
        sendBotResponse: function() {
            var self = this;
            var payload = {
                'executed_action': self.next_action,
                'events': []
            };
            App.showProcessing()
            App.remotePost('http://127.0.0.1:5005/conversations/default/continue', payload, 
            function(res){
                self.response = res;
                self.next_action = res.next_action;
                App.hideProcessing()
            }, function(err){
                App.notifyUser(err, "error");
                App.hideProcessing()
            });  
        },
        sendMessage: function() {
            var self = this;
            var payload = {
                'query': this.message
            }
            App.showProcessing()
            App.remoteGet('http://127.0.0.1:5005/conversations/default/parse?'+$.param(payload), {}, 
            function(res){
                self.response = res;
                self.next_action = res.next_action;
                self.message = '';
                App.hideProcessing();
            }, function(err){
                App.notifyUser(err, "error");
                App.hideProcessing()
            });  
        }
    }
});