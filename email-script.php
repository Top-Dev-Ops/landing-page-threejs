<?php
	if($_POST){

		$name=$_POST['name'] ;
	    $email=$_POST['email'];
	    $phone=$_POST['phone'];
	    $message=$_POST['message'];
	    $to=$_POST['toEmail'];

	    $subject = 'Contact Fitzpatrck Group';

	    mail($to, $subject, nl2br('Name: '.$name.'\r\n'.'Email: '.$email.'\r\n'.'Phone Number: '.$phone.'\r\n'.'Message: '.$message));

		// echo nl2br('Name: '.$name.'\r\n'.'Email: '.$email.'\r\n'.'Phone Number: '.$phone.'\r\n'.'Message: '.$message);
	}

?>