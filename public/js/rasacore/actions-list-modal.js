var actionsListModalTemp = `
<modal v-model="show_modal" @cancel="closeModal">
    <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">Actions</h4>
    </div>
    <div slot="modal-body" class="modal-body">
        <div class="form-group row">
            <div class="col-md-6">
                <input type="text" v-model="action.name" placeholder="Type new action"  class="form-control">
            </div>
            <div class="col-md-6">
                <button class="btn btn-md btn-primary" @click="saveNewAction()">
                    <i class="fa fa-check"></i> Save
                </button>
            </div>
        </div>
        <table class="table table-bordered table-condensed">
            <thead>
                <tr>
                    <th colspan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="action in actions">
                    <td class="col-md-10">
                        <span v-if="!action.editmode">{{action.name}}</span>
                        <span v-if="action.editmode">
                            <input type="text" v-model="action.name" class="form-control input-sm">
                        </span>
                    </td>
                    <td class="col-md-2 text-center">
                        <a v-if="action.editmode" href="javascript:;" class="btn btn-xs btn-success" @click="saveAction(action)">
                            <i class="fa fa-save"></i>
                        </a>
                        <a v-if="action.editmode" href="javascript:;" class="btn btn-xs btn-primary" @click="exitEditMode(action)">
                            <i class="fa fa-undo"></i>
                        </a>
                        
                        <a v-if="!action.editmode" href="javascript:;" class="btn btn-xs btn-primary" @click="enterEditMode(action)">
                            <i class="fa fa-pencil"></i>
                        </a>
                        <a v-if="!action.editmode" href="javascript:;" class="btn btn-xs btn-danger" @click="removeAction(action)">
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

Vue.component('actionsListModal', {
    template: actionsListModalTemp,
    props: ['show',],
    components: {
        modal: VueStrap.modal
    },
    created: function() {
        this.getActions();
    },
    watch: {
        'show': function(newVal, oldVal) {
            this.show_modal = newVal;
        }
    },
    data: function(){
        return {
            show_modal: false,
            actions: [],
            action: {
                name: ''
            }
        }
    },
    methods: {
        getActions: function() {
            var self = this;
            App.showProcessing()
            App.remoteGet('/api/v1.0/actions/', {}, 
            function(res){
                self.actions = res.results;
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
        enterEditMode: function(action) {
            this.$set(action, 'editmode', true);
        },
        exitEditMode: function(action) {
            this.$set(action, 'editmode', false);
        },
        saveAction: function(action) {
            var self = this;
            App.showProcessing()
            App.remotePut('/api/v1.0/actions/'+action.id+'/', action, 
            function(res){
                self.$set(action, 'editmode', false);
                App.hideProcessing();
                App.notifyUser('Action saved');
            }, function(err){
                App.notifyUser(err.responseText, "error");
                App.hideProcessing();
            });
        },
        removeAction: function(action) {
            var self = this;
            App.showProcessing()
            App.remoteDelete('/api/v1.0/actions/'+action.id+'/', {}, 
            function(res){
                // Remove action from list
                var action_index = self.actions.indexOf(action);
                self.actions.splice(action_index, 1);

                App.hideProcessing();
                App.notifyUser('Action removed');
            }, function(err){
                App.notifyUser(err.responseText, "error");
                App.hideProcessing();
            });
        },
        saveNewAction: function() {
            var self = this;
            App.showProcessing()
            App.remotePost('/api/v1.0/actions/', this.action, 
            function(res){
                self.actions.unshift(res);
                self.$set(self.action, 'name', '');
                
                App.hideProcessing();
                App.notifyUser('Action added');
            }, function(err){
                App.notifyUser(err.responseText, "error");
                App.hideProcessing();
            });
        },
    }
});