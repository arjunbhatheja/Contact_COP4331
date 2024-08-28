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
		$smp = $conn-> prepare("Select * from Users WHERE Login = ? and Password = ?");
		$smp->bind_param("s", $login);
		$smp->execute();
		$result = $smp->get_result();
		$rows = mysqli_num_rows($result);
		if ($rows == 0)
		{
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
			returnWithError("Username taken");
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
