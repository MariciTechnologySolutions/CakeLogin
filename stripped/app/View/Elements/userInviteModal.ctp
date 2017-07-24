<div class="modal fade" id="userInvite" role="dialog" aria-labelledby="register" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Invite User</h4>
            </div>
            <div class="modal-body">
                <form id="userInviteForm" class="contactForm" data-target="#message_form" method="post">
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 cfItem">
                            <input id="userInviteName" type="text" placeholder="Name" class="form-control" value="Steve Peterson" required>
                         </div>
                        
                        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 cfItem">
                            <input id="userInviteEmail" type="email" placeholder="Email" class="form-control" value="steve@us-acquisitions.com" required>
                        </div>
                        
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <a href="#" id="userInviteSubmit" data-dismiss="modal" class="btn btn-round btn-o btn-blue">Send Invitation</a>
                <a href="#" data-dismiss="modal" class="btn btn-round btn-o btn-gray">Cancel</a>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="userInviteThanks" role="dialog" aria-labelledby="thanks" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Submitted. </h4>
            </div>
            <div class="modal-body">
               <div id="invitationResponse"></div>
            </div>
            <div class="modal-footer">
                <a href="#" data-dismiss="modal" class="btn btn-round btn-o btn-gray">OK</a>
            </div>
        </div>
    </div>
</div>