<currentaddresses>
    <h2>Current voter addresses</h2>
    <div><p class='error' if={ error }>{ error }</p>
        <ul>
            <li each={ addy, i in data }>
                { addy }
            </li>
        </ul>
    </div>

    <script>
        var self = this

        $.get('/getaddresses')
            .fail(function(error_message) {
                self.error = error_message
                self.update()
            })
            .done(function(data) {
                    self.data = data;
                    self.update()
                }
            );

    </script>


</currentaddresses>

