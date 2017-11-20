var chatTemp = `
    <div class="chat-interface">
        <div class="body">
            <div class="close-chat text-right">
                <a href="javascript:;" @click="closeChat()">
                    <i class="fa fa-times"></i>
                </a>
            </div>
            <div class="response">
                {{ response }}
            </div>
        </div>
        <div class="divider"></div>
        <div class="action">
            <div class="send-action">
                <div class="row">
                    <div class="pull-left">
                        Bot expected action <strong>utter_greetings</strong>
                    </div>
                    <div class="pull-right">
                        <button class="btn btn-default" @click="sendBotResponse()">
                            Perform <i class="fa fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="pull-left">
                        <button class="btn btn-success" @click="startConversation()">
                            Start
                        </button>
                    </div>
                </div>
            </div>
            <div class="input-group send-text">
                <input type="text" class="form-control" v-model="message" placeholder="User response"> 
                <span class="input-group-btn">
                    <button class="btn btn-primary" type="button" @click="sendMessage()">Send</button>
                </span>
            </div>
        </div>
    </div>
`;

Vue.component('chat', {
    template: chatTemp,
    props: ['show'],
    data: function() {
        return {
            message: '',
            response: ''
        }
    },
    methods: {
        closeChat: function() {
            this.$emit('update:show', false);
        },
        sendBotResponse: function() {
            var self = this;
            var payload = {
                'state': 'continue',
                'executed_action': ''
            };
            App.showProcessing()
            App.remotePost('/api/v1.0/chat/', payload, 
            function(res){
                self.response = res;
                App.hideProcessing()
            }, function(err){
                App.notifyUser(err, "error");
                App.hideProcessing()
            });  
        },
        sendMessage: function() {
            var self = this;
            var payload = {
                'state': 'parse',
                'message': this.message
            }
            App.showProcessing()
            App.remotePost('/api/v1.0/chat/', payload, 
            function(res){
                self.response = res;
                App.hideProcessing()
            }, function(err){
                App.notifyUser(err, "error");
                App.hideProcessing()
            });  
        },
        startConversation: function() {
            var self = this;
            var payload = {
                'state': 'start',
                'message': this.message
            }
            App.showProcessing()
            App.remotePost('/api/v1.0/chat/', payload, 
            function(res){
                self.response = res;
                App.hideProcessing()
            }, function(err){
                App.notifyUser(err, "error");
                App.hideProcessing()
            });  
        }
    }
});