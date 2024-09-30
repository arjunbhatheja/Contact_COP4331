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
		if((strlen(trim($inData["firstName"])) == 0)||(strlen(trim($inData["lastName"])) == 0)||(strlen(trim($inData["phone"])) == 0)||(strlen(trim($inData["email"])) == 0)){
			http_response_code(400);
      returnWithInfo("Fill in information");
			exit();
		}
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?,  LastName =?,  Phone = ?,  Email = ? WHERE ID = ? AND UserID = ?");
		$stmt->bind_param("ssssii",$inData["firstName"],$inData["lastName"],$inData["phone"],$inData["email"], $inData["id"],$inData["userId"]);
		$stmt->execute();
		$affectedRows = $stmt->affected_rows;
    
    		if ($affectedRows > 0) {
        		http_response_code(200);
        		returnWithInfo("Contact updated successfully");
    		} else {
       			http_response_code(400);
        		returnWithError("Update failed: No matching contact found with the given  Id");
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
