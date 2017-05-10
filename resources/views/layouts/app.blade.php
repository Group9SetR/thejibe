<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>TheJibe My Schedule</title>

    <!-- Bootstrap Core CSS -->
    <link href="/css/app.css" rel="stylesheet">
    <link href="/css/dashboard.css" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">


</head>
<body>
    <div id="app">
        <div class="firstnav" id="myFirstnav">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand text-white" href="#"><font color="white">My shedule</font></a>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <li color = "white"><a href="#"><font color="white">My Account</font></a></li>
                    </ul>
                </div><!--/.nav-collapse -->
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
        @yield('content')



    </div>

    <!-- Scripts -->
    <script src="/js/app.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

</body>
</html>
