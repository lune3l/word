function getData() {
    var url = 'https://php.flare.moe/jpdb/query.php?query=SELECT%20*%20FROM%20USERS';
    axios.get(url)
        .then(response => {
            // Process the response data
            //var result =  JSON.stringify(response.data).replace(/\\/g, '');
            var result = response.data;
            
            document.getElementById("output").innerHTML = typeof(result);
            //result = result.substring(1, result.length - 1);
            //result = result.trim();
            
            //var arr = result.split(" ");
            //document.getElementById("output").innerHTML = JSON.parse(arr[0]).ID;
        })
        .catch(error => {
            // Handle errors
            console.error(error);
        });
}