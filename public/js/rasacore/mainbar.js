// Main footer actions
var TrainingMainBar = new Vue({
    el: "#trainingMainBar",
    data: function() {
        return {
            showchat: false
        }
    },
    methods: {
        doTraining: function() {
            var self = this;
            App.showProcessing()
            App.remotePost('/api/v1.0/train/', {}, 
            function(res){
                App.hideProcessing();
                App.notifyUser('Training started');
            }, function(err){
                App.notifyUser(err.responseText, "error");
                App.hideProcessing()
            });
        },
        showChat: function() {
            this.showchat = true;
        }
    }
});