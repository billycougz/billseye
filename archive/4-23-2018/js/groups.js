var groupTable;
var groupMembersTable;

function createGroupTable(data) {
	groupTable = $('<table id="groupTableID" class="table table-hover"><tr><th>#</th><th>Group Name </th><th>Primary Location </th></tr><tbody></tbody></table>');
	for (var i = 0; i < data.length; i++) {
		var groupTableRow = $('<tr class="groupRow" data-group-members="' + data[i].members + '"></tr>');
		$(groupTableRow).append("<td>"+ (i+1) +"</td>");
		$(groupTableRow).append("<td>"+data[i].name+"</td>");
		$(groupTableRow).append("<td>"+data[i].location+"</td>");
		$(groupTableRow).bind("click", createGroupModal);
		$(groupTable).append(groupTableRow);
	}
}

$("#groups-button, #mobile-groups").on("click", function(){
	createGroupTable(groups);
	$("#gameTable").html(groupTable);
	$("#data-table-container").css("visibility", "visible");
	//filterGroups();
	$("#tile-header").html("Groups");
	$("#gameFilter").css("display", "none");
	$("#playerFilter").css("display", "none");
	$("#filter-title").html("Filter Groups");
	activeFilter = 'group';  
	$("#main-filter").css("display", "none");
	$("#groups-options-container").css("display", "block");
});

var createGroupModal = function() {
	var groupMembers = $(this).attr("data-group-members");
	createGroupMembersTable(groupMembers);
	$("#groupMembersTable").html(groupMembersTable);
	
	$('#detailModalTitle').html('Group Members');
	$('#playerGameTableHeader').html("");
	$('#playerGameTable').html("");
	$("#main-filter-inputs").css("display", "none");
	$("#groupMembersTable").css("display", "block");
}

function createGroupMembersTable(data) {
	groupMembersTable = $('<table id="groupMembersTableID" class="table table-hover"><tr><th>#</th><th>Member </th></tr><tbody></tbody></table>');
	data = data.split(",");
	for (var i = 0; i < data.length; i++) {
		var groupMembersTableRow = $('<tr class=""></tr>');
		$(groupMembersTableRow).append("<td>"+ (i+1) +"</td>");
		$(groupMembersTableRow).append("<td>"+data[i]+"</td>");
		$(groupMembersTable).append(groupMembersTableRow);
	}
}