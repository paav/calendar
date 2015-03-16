<!--
vim: ts=2:sw=2:sts=2
-->
<!DOCTYPE html>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Calendar</title>
<!--[if lt IE 9]>
  <script src="//oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="//oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="../calendar.js"></script>
<link href="../calendar.css" rel="stylesheet">
<script>
  $(function() {
    paav.calendar.create('.datesetter');
  });
</script>
<main>
  <input class="datesetter" type="text">
</main>
