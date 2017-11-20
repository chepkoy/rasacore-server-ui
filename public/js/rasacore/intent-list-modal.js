var intentListModalTemp = `
<modal v-model="show_modal" @cancel="closeModal">
    <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">Intents</h4>
    </div>
    <div slot="modal-body" class="modal-body">
        <table class="table table-bordered table-condensed">
            <thead>
                <tr>
                    <th colspan="2">Intent</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="intent in intents">
                    <td class="col-md-10">
                        <span v-if="!intent.editmode">{{intent.name}}</span>
                        <span v-if="intent.editmode">
                            <input type="text" v-model="intent.name" class="form-control input-sm">
                        </span>
                    </td>
                    <td class="col-md-2 text-center">
                        <a v-if="intent.editmode" href="javascript:;" class="btn btn-xs btn-success" @click="saveIntent(intent)">
                            <i class="fa fa-save"></i>
                        </a>
                        <a v-if="intent.editmode" href="javascript:;" class="btn btn-xs btn-primary" @click="exitEditMode(intent)">
                            <i class="fa fa-undo"></i>
                        </a>
                        
                        <a v-if="!intent.editmode" href="javascript:;" class="btn btn-xs btn-primary" @click="enterEditMode(intent)">
                            <i class="fa fa-pencil"></i>
                        </a>
                        <a v-if="!intent.editmode" href="javascript:;" class="btn btn-xs btn-danger" @click="removeIntent(intent)">
                            <i class="fa fa-times"></i>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div slot="modal-footer" class="modal-footer">
        <button type="button" class="btn btn-default" @click="closeModal()">Close</button>
    </div>
</modal>
`;

Vue.component('intentListModal', {
    template: intentListModalTemp,
    props: ['show',],
    components: {
        modal: VueStrap.modal
    },
    created: function() {
        this.getIntents();
    },
    watch: {
        'show': function(newVal, oldVal) {
            this.show_modal = newVal;
        }
    },
    data: function(){
        return {
            show_modal: false,
            intents: []
        }
    },
    methods: {
        getIntents: function() {
            var self = this;
            App.showProcessing()
            App.remoteGet('/api/v1.0/intents/', {}, 
            function(res){
                self.intents = res.results;
                App.hideProcessing();
            }, function(err){
                App.notifyUser(err.responseText, "error");
                App.hideProcessing();
            });
        },
        closeModal: function() {
            this.show_modal = false;
            this.$emit('update:show', false);
        },
        enterEditMode: function(intent) {
            this.$set(intent, 'editmode', true);
        },
        exitEditMode: function(intent) {
            this.$set(intent, 'editmode', false);
        },
        saveIntent: function(intent) {
            var self = this;
            App.showProcessing()
            App.remotePut('/api/v1.0/intents/'+intent.id+'/', intent, 
            function(res){
                self.$set(intent, 'editmode', false);
                App.hideProcessing();
                App.notifyUser('Intent saved');
            }, function(err){
                App.notifyUser(err.responseText, "error");
                App.hideProcessing();
            });
        },
        removeIntent: function(intent) {
            var self = this;
            App.showProcessing()
            App.remoteDelete('/api/v1.0/intents/'+intent.id+'/', {}, 
            function(res){
                // Remove intent from list
                var intent_index = self.intents.indexOf(intent);
                self.intents.splice(intent_index, 1);
                
                App.hideProcessing();
                App.notifyUser('Intent removed');
            }, function(err){
                App.notifyUser(err.responseText, "error");
                App.hideProcessing();
            });
        }
    }
});