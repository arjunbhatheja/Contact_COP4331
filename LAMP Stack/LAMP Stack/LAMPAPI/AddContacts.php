<?php
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		if((strlen(trim($inData["firstName"])) == 0)||(strlen(trim($inData["lastName"])) == 0)||(strlen(trim($inData["phone"])) == 0)||(strlen(trim($inData["email"])) == 0)){
			http_response_code(400);
      returnWithInfo("Fill in information");
			exit();
		}
		

		$mon = $conn->prepare("Select * from Users WHERE ID = ?");
		$mon->bind_param("i", $inData["userId"]);
		$mon->execute();
		$res = $mon->get_result();
			
		$userrow = mysqli_num_rows($res);

		if($userrow != 0){
			if(!empty($inData["firstName"])){
			$smp = $conn->prepare("Select * from Contacts WHERE FirstName = ? and LastName = ? and Phone = ?");
			$smp->bind_param("sss", $inData["firstName"], $inData["lastName"],$inData["phone"]);
			$smp->execute();
			$result = $smp->get_result();
			$rows = mysqli_num_rows($result);
			if($rows == 0){
				$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName, Phone, Email, UserID) VALUES(?,?,?,?,?)");
				$stmt->bind_param("ssssi", $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"],$inData["userId"]);
				$stmt->execute();
				$stmt->close();
				$smp->close();
				$mon->close();
				$conn->close();
				}
			else{
				http_response_code(409);
				returnWithError("Contact already exists");
				}
			}
			else{
				http_response_code(400);
			returnWithError("Name required");
			}
		}
		 else{
			http_response_code(406);
			returnWithError("UserId is invalid");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
