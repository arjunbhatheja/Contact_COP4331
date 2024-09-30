<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$smp = $conn-> prepare("Select * from Users WHERE BINARY Login = ?");
		$smp->bind_param("s", $inData["login"]);
		$smp->execute();
		$result = $smp->get_result();
		$rows = mysqli_num_rows($result);
		if ($rows == 0)
		{
			if((strlen(trim($inData["firstName"])) == 0)||(strlen(trim($inData["lastName"])) == 0)||(strlen(trim($inData["login"])) == 0)||(strlen(trim($inData["password"])) == 0)){
				http_response_code(400);
				returnWithInfo("Fill in information");
				exit();
			}
			$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
			$stmt->execute();
			$id = $conn->insert_id;
			$stmt->close();
			$conn->close();
			$searchResults .= '{'.'"id": "'.$id.''.'"}';

			returnWithInfo($searchResults);
		} else {
			http_response_code(409);
			returnWithError("Please select a unique user name");
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
