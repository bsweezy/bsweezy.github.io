var t = TrelloPowerUp.initialize({
    'header-buttons': function(t) {
        return [{
            // Make sure you have an icon at this path!
            icon: './images/clock_icon.svg', 
            text: 'Recent Activity', 
            callback: function(t) {
                // This URL must match the location of your HTML file
                return t.popup({
                    title: 'Recently Modified Cards',
                    url: './recent_activity_popup.html' 
                });
            }
        }];
    }
});
