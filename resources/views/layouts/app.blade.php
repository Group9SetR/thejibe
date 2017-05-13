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
    <link href="/css/timer.css" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.com/libraries/bootstrap-slider">
    @yield('css')
    <!-- Scripts -->
    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>

        var myVar;

        function myFunction() {
            myVar = setTimeout(showPage, 3000);
        }

        function showPage() {
            document.getElementById("loader").style.display = "none";
            document.getElementById("myDiv").style.display = "block";
        }




    </script>
</head>
<body onload="myFunction()" style="margin:0;">
<div id="loader"></div>
<div style="display:none;" id="myDiv">
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
                            <font color="white">{{ config('app.name', 'Laravel') }}</font>
                        </a>
                    </div>
                    <div class="collapse navbar-collapse" id="app-navbar-collapse">
                        <!-- Right Side Of Navbar -->
                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="#"><font color="white">My Account</font></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            @yield('nav')
        </nav>

        @yield('content')
    </div>

    <div class="modal fade openTimerConfirmModal" id="confirmTimerModal" tabindex="-1" role="dialog" style="width:500px; height: 500px;">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="confirmTimerModalLabel">Timer</h4>
                </div>
                <div class="modal-body">
                    Test
                </div>
                <div class="modal-footer">
                    <input type="submit" placeholder="Save" id="timerSubmit" name="confirmTimerBtn" class="btn btn-success openConfirmTimerModal">
                    <button type="button" id="closeConfirmTimerBtn" class="btn btn-warning" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="/js/app.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    @yield('javascript')
    </div>
</body>

<footer id="timerbox" style="position: fixed; bottom: 0; display: block; padding-left: 5px; visibility: hidden;">
    <button style="width: 250px;" type="button" data-toggle="collapse" data-target="#demo">TIMER - Pause - Log Time</button>
    <button id="closeTimerbox" class="label-danger">x</button>

    <div class="container" style="background-color: lightblue; width: 275px; text-align: center;">
        <div id="demo" class="collapse">
            <br/>
            Task: Create time-tracking widget
            <br/><br/>
            Log Time
            <br/><br/>
            <textarea>Optional description</textarea>
            <br/><br/>
            <button class="btn btn-success openTimerConfirmModal" data-toggle="modal" data-target="#confirmTimerModal">Log Time</button>
            <br/><br/>

            <button>Pause</button>
            <button>Log Time</button>
        </div>
    </div>
</footer>

<script>
    // script to hide timerbox visibility
    $('#closeTimerbox').click(function(){
        $('#timerbox').css('visibility', 'hidden');
    });
</script>
</html>
