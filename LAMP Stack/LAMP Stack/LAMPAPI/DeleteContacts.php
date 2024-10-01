<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? and UserId = ?");
		$stmt->bind_param("ii", $inData["id"], $inData["userId"]);
		$stmt->execute();

		if ($stmt->affected_rows > 0) 
			{
		http_response_code(200);
		returnWithInfo("Contact deleted successfully");
		}
		else
			{
		http_response_code(404);
		returnWithError("Contact not found");
		}
		
		$stmt->close();
		$conn->close();

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
