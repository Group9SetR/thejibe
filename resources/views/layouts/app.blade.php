<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="/css/app.css" rel="stylesheet">
    <link href="/css/dashboard.css" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <!-- Scripts -->
    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>
</head>
<body>
    <div id="app">
        <nav>
            <div class="firstnav" id="myFirstnav">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <!-- Branding Image -->
                        <a class="navbar-brand" href="{{ url('/') }}">
                            {{ config('app.name', 'Laravel') }}
                        </a>
                    </div>

                    <div class="collapse navbar-collapse" id="app-navbar-collapse">
                        <!-- Right Side Of Navbar -->
                        <ul class="nav navbar-nav navbar-right">
                            <li color = "white"><a href="#"><font color="white">My Account</font></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="secondnav" id="mySecondnav">
                <div class="form-group">
                    <div class="col-sm-2">
                        <select class="form-control" id="client">
                            <option>All Clients</option>
                            <option>client 1</option>
                            <option>client 2</option>
                        </select>
                    </div>
                    <div class="col-sm-2">
                        <select class="form-control" id="project">
                            <option>All Projects</option>
                            <option>project 1</option>
                            <option>project 2</option>
                        </select>
                    </div>
                    <div class="col-sm-2">
                        <select class="form-control" id="priority">
                            <option>All Priorities</option>
                            <option>Priorities 1</option>
                            <option>Priorities 2</option>
                        </select>
                    </div>
                    <div id="navbar" class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-right ">
                            <div class ="form-inline">
                                <input type = "date">
                                <input type = "date">
                            </div>

                        </ul>
                    </div><!--/.nav-collapse -->
                </div>
            </div>
        </nav>

        @yield('content')

    <!-- Scripts -->
    <script src="/js/app.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</body>
</html>
