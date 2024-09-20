<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=\, initial-scale=1.0">
    <link rel="stylesheet" href="https://kit-pro.fontawesome.com/releases/v5.12.1/css/pro.min.css">
    <link rel="stylesheet" type="text/css" href="cms/css/style.css">  

    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body>
    @inertia
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="{{ asset('cms/js/scripts.js') }}"></script></body>
</html>