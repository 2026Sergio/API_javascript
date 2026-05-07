fetch("https://disease.sh/v3/covid-19/countries")
    .then(response => response.json())
    .then(data => console.log(data));