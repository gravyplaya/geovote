<currentassets>

    <div><p class='error' if={ error }>{ error }</p>
        <ul>
            <li each={ data }>
                Name: { name } <br />
                Qty issued: { issueqty } <br />
                ID: {issuetxid}
            </li>
        </ul>
    </div>

    <script>
        var self = this

        $.get('/getassets')
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


</currentassets>

