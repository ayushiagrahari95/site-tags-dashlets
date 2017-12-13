(function(){var b=YAHOO.util.Dom,v=YAHOO.util.Event;var o=Alfresco.util.encodeHTML,f=Alfresco.util.userProfileLink;Alfresco.PeopleFinder=function(w){Alfresco.PeopleFinder.superclass.constructor.call(this,"Alfresco.PeopleFinder",w,["button","container","datasource","datatable","json"]);this.userSelectButtons={};this.searchTerm="";this.singleSelectedUser="";this.selectedUsers={};this.notAllowed={};this.following={};this.isAddUsersPage=w.indexOf("_add-users_")>0;YAHOO.Bubbling.on("personSelected",this.onPersonSelected,this);YAHOO.Bubbling.on("personDeselected",this.onPersonDeselected,this);return this};YAHOO.lang.augmentObject(Alfresco.PeopleFinder,{VIEW_MODE_DEFAULT:"",VIEW_MODE_COMPACT:"COMPACT",VIEW_MODE_FULLPAGE:"FULLPAGE"});YAHOO.lang.extend(Alfresco.PeopleFinder,Alfresco.component.Base,{options:{siteId:"",viewMode:Alfresco.PeopleFinder.VIEW_MODE_DEFAULT,singleSelectMode:false,showSelf:true,minSearchTermLength:1,maxSearchResults:100,setFocus:false,addButtonLabel:null,addButtonSuffix:"",dataWebScript:"",userId:""},userSelectButtons:null,searchTerm:null,singleSelectedUser:null,selectedUsers:null,notAllowed:null,isSearching:false,followingAllowed:false,following:null,onReady:function t(){var x=this;if(this.isAddUsersPage){this.options.viewMode=Alfresco.PeopleFinder.VIEW_MODE_COMPACT}if(this.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT){b.addClass(this.id+"-body","compact");b.removeClass(this.id+"-results","hidden")}else{if(this.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_FULLPAGE){b.addClass(this.id+"-results","alf-full-page");b.removeClass(this.id+"-help","hidden");Alfresco.util.Ajax.jsonGet({url:Alfresco.constants.PROXY_URI+"api/subscriptions/"+encodeURIComponent(this.options.userId)+"/following",successCallback:{fn:function(B){if(B.json.people){var E={};var D=B.json.people;for(var C=0;C<D.length;C++){E[D[C].userName]=true}x.following=E}x.followingAllowed=true},scope:this}})}else{b.addClass(this.id+"-results","alf-default");b.removeClass(this.id+"-results","hidden")}}this.widgets.searchButton=Alfresco.util.createYUIButton(this,"search-button",this.onSearchClick);var A=Alfresco.constants.PROXY_URI+YAHOO.lang.substitute(this.options.dataWebScript,this.options);A+=(A.indexOf("?")<0)?"?":"&";this.widgets.dataSource=new YAHOO.util.DataSource(A,{responseType:YAHOO.util.DataSource.TYPE_JSON,connXhrMode:"queueRequests",responseSchema:{resultsList:"people"}});this.widgets.dataSource.doBeforeParseData=function z(G,D){var C=D;if(D){var B=D.people,E,F;if(B.length>x.options.maxSearchResults){B=B.slice(0,x.options.maxSearchResults-1)}if(!x.options.showSelf){for(E=0,F=B.length;E<F;E++){if(B[E].userName==Alfresco.constants.USERNAME){B.splice(E,1);break}}}x.notAllowed={};if(D.notAllowed){x.notAllowed=Alfresco.util.arrayToObject(D.notAllowed)}C={people:B}}return C};this._setupDataTable();var y=b.get(this.id+"-search-text");var w=new YAHOO.util.KeyListener(y,{keys:YAHOO.util.KeyListener.KEY.ENTER},{fn:function(B,C,D){x.onSearchClick();v.stopEvent(C[1]);return false},scope:this,correctScope:true},YAHOO.env.ua.ie>0?YAHOO.util.KeyListener.KEYDOWN:"keypress");w.enable();if(this.options.setFocus){y.focus()}},fnRenderCellAvatar:function a(){var x=this;return function w(A,z,B,C){b.setStyle(A.parentNode,"width",B.width+"px");var y=Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png";if(z.getData("avatar")!==undefined){y=Alfresco.constants.PROXY_URI+z.getData("avatar")+"?c=queue&ph=true"}A.innerHTML='<img class="avatar" src="'+y+'" alt="avatar" />'}},fnRenderCellDescription:function c(){var x=this;return function w(F,I,C,A){var E=I.getData("userName"),z=E,G=I.getData("firstName"),H=I.getData("lastName");if((G!==undefined)||(H!==undefined)){z=G?G+" ":"";z+=H?H:""}var D=I.getData("jobtitle")||"",y=I.getData("organization")||"";var B='<h3 class="itemname">'+f(E,z,'class="theme-color-1" tabindex="0"')+' <span class="lighter">('+o(E)+")</span></h3>";if(D.length!==0){if(x.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT){B+='<div class="detail">'+o(D)+"</div>"}else{B+='<div class="detail"><span>'+x.msg("label.title")+":</span> "+o(D)+"</div>"}}if(y.length!==0){if(x.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT){B+='<div class="detail">&nbsp;('+o(y)+")</div>"}else{B+='<div class="detail"><span>'+x.msg("label.company")+":</span> "+o(y)+"</div>"}}F.innerHTML=B}},fnRenderCellActions:function q(){var w=this;return function x(F,G,D,y){b.setStyle(F.parentNode,"width",D.width+"px");b.setStyle(F.parentNode,"text-align","right");var E=G.getData("userName"),C='<span id="'+w.id+"-action-"+E+'" class="alf-colored-button"></span>';F.innerHTML=C;if(w.options.viewMode!==Alfresco.PeopleFinder.VIEW_MODE_FULLPAGE){var A;if(!w.options.addButtonLabel){if(w.isAddUsersPage){A=w.msg("button.select")}else{A=w.msg("button.add")+" "+w.options.addButtonSuffix}}else{A=w.options.addButtonLabel+" "+w.options.addButtonSuffix}var B=new YAHOO.widget.Button({type:"button",label:A,name:w.id+"-selectbutton-"+E,container:w.id+"-action-"+E,tabindex:0,disabled:E in w.notAllowed,onclick:{fn:w.onPersonSelect,obj:G,scope:w}});w.userSelectButtons[E]=B;if((E in w.selectedUsers)||(w.options.singleSelectMode&&w.singleSelectedUser!=="")){w.userSelectButtons[E].set("disabled",true)}}if(w._renderFollowingActions(G)){var z=w.following[E];var B=new YAHOO.widget.Button({type:"button",label:z?w.msg("button.unfollow"):w.msg("button.follow"),name:w.id+"-followbutton-"+E,container:w.id+"-action-"+E,tabindex:0});B.set("onclick",{fn:z?w.onPersonUnfollow:w.onPersonFollow,obj:{record:G,button:B},scope:w})}}},_renderFollowingActions:function u(w){return(this.followingAllowed&&this.options.viewMode===Alfresco.PeopleFinder.VIEW_MODE_FULLPAGE&&this.options.userId!==w.getData("userName"))},_setupDataTable:function j(){var x=[{key:"avatar",label:"Avatar",sortable:false,formatter:this.fnRenderCellAvatar(),width:this.options.viewMode==Alfresco.PeopleFinder.VIEW_MODE_COMPACT?36:70},{key:"person",label:"Description",sortable:false,formatter:this.fnRenderCellDescription()},{key:"actions",label:"Actions",sortable:false,formatter:this.fnRenderCellActions()}];this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-results",x,this.widgets.dataSource,{renderLoopSize:Alfresco.util.RENDERLOOPSIZE,initialLoad:false,MSG_EMPTY:this.msg("message.instructions")});this.widgets.dataTable.doBeforeLoadData=function w(y,z,A){if(z.results){this.renderLoopSize=Alfresco.util.RENDERLOOPSIZE}return true};this.widgets.dataTable.subscribe("rowMouseoverEvent",this.widgets.dataTable.onEventHighlightRow);this.widgets.dataTable.subscribe("rowMouseoutEvent",this.widgets.dataTable.onEventUnhighlightRow)},clearResults:function e(){if(this.widgets.dataTable){var w=this.widgets.dataTable.getRecordSet().getLength();this.widgets.dataTable.deleteRows(0,w)}this._setupDataTable();var x=this.id+"-results-info";b.addClass(x,"hidden");b.get(this.id+"-search-text").value="";this.singleSelectedUser="";this.selectedUsers={}},onPersonSelect:function d(w,y){var x=y.getData("userName");YAHOO.Bubbling.fire("personSelected",{eventGroup:this,userName:x,firstName:y.getData("firstName"),lastName:y.getData("lastName"),email:y.getData("email")})},onPersonFollow:function m(x,z){var y=z.record.getData("userName");z.button.set("disabled",true);var w=this;Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/subscriptions/"+encodeURIComponent(this.options.userId)+"/follow",method:Alfresco.util.Ajax.POST,dataObj:[y],requestContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:function(A){z.button.set("label",w.msg("button.unfollow"));z.button.set("onclick",{fn:w.onPersonUnfollow,obj:{record:z.record,button:z.button},scope:w});w.following[y]=true;z.button.set("disabled",false)},scope:this},failureCallback:{fn:function(B){var A=Alfresco.util.parseJSON(B.serverResponse.responseText);Alfresco.util.PopupManager.displayPrompt({title:this._msg("message.failure"),text:A.message});z.button.set("disabled",false)},scope:this}})},onPersonUnfollow:function n(x,z){var y=z.record.getData("userName");z.button.set("disabled",true);var w=this;Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/subscriptions/"+encodeURIComponent(this.options.userId)+"/unfollow",method:Alfresco.util.Ajax.POST,dataObj:[y],requestContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:function(A){z.button.set("label",w.msg("button.follow"));z.button.set("onclick",{fn:w.onPersonFollow,obj:{record:z.record,button:z.button},scope:w});w.following[y]=false;z.button.set("disabled",false)},scope:this},failureCallback:{fn:function(B){var A=Alfresco.util.parseJSON(B.serverResponse.responseText);Alfresco.util.PopupManager.displayPrompt({title:this._msg("message.failure"),text:A.message});z.button.set("disabled",false)},scope:this}})},onSearchClick:function r(y,z){var x=b.get(this.id+"-search-text");var w=YAHOO.lang.trim(x.value);if(w.replace(/\*/g,"").length<this.options.minSearchTermLength){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.minimum-length",this.options.minSearchTermLength)});return}this.userSelectButtons={};this._performSearch(w)},onPersonSelected:function h(y,w){var A=w[1];if(A&&(A.userName!==undefined)){var z=A.userName;this.selectedUsers[z]=true;this.singleSelectedUser=z;if(this.options.singleSelectMode){for(var x in this.userSelectButtons){if(this.userSelectButtons.hasOwnProperty(x)){this.userSelectButtons[x].set("disabled",true)}}}else{if(this.userSelectButtons[z]){this.userSelectButtons[z].set("disabled",true)}}}},onPersonDeselected:function p(y,w){var z=w[1];if(z&&(z.userName!==undefined)){delete this.selectedUsers[z.userName];this.singleSelectedUser="";if(this.options.singleSelectMode){for(var x in this.userSelectButtons){if(this.userSelectButtons.hasOwnProperty(x)){this.userSelectButtons[x].set("disabled",false)}}}else{if(this.userSelectButtons[z.userName]){this.userSelectButtons[z.userName].set("disabled",false)}}}},_setDefaultDataTableErrors:function i(w){var x=Alfresco.util.message;w.set("MSG_EMPTY",x("message.empty","Alfresco.PeopleFinder"));w.set("MSG_ERROR",x("message.error","Alfresco.PeopleFinder"))},_displayResultInfo:function g(w,y){var z=this.id+"-results-info";var x=function(C,B){if(B){b.removeClass(C,"hidden")}else{b.addClass(C,"hidden")}};var A=Alfresco.util.message;if(w==0){document.getElementById(z).innerHTML="";x(z,false)}else{if(w<y){document.getElementById(z).innerHTML=A("message.results","Alfresco.PeopleFinder",this.searchTerm,w);x(z,true)}else{document.getElementById(z).innerHTML=A("message.maxresults","Alfresco.PeopleFinder",y);x(z,true)}}},_performSearch:function s(w){if(!this.isSearching){this.isSearching=true;this._setDefaultDataTableErrors(this.widgets.dataTable);this.widgets.dataTable.set("MSG_EMPTY",this.msg("message.searching"));this.widgets.dataTable.deleteRows(0,this.widgets.dataTable.getRecordSet().getLength());var x=function z(B,C,D){if(this.options.viewMode!=Alfresco.PeopleFinder.VIEW_MODE_COMPACT){if(b.hasClass(this.id+"-results","hidden")){b.removeClass(this.id+"-results","hidden");b.addClass(this.id+"-help","hidden")}}this._enableSearchUI();this._setDefaultDataTableErrors(this.widgets.dataTable);this._displayResultInfo(C.results.length,this.options.maxSearchResults);this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,B,C,D)};var y=function A(C,D){this._enableSearchUI();if(D.status==401){window.location.reload()}else{try{var B=YAHOO.lang.JSON.parse(D.responseText);this.widgets.dataTable.set("MSG_ERROR",B.message);this.widgets.dataTable.showTableMessage(Alfresco.util.encodeHTML(B.message),YAHOO.widget.DataTable.CLASS_ERROR)}catch(E){this._setDefaultDataTableErrors(this.widgets.dataTable)}}};this.searchTerm=Alfresco.util.encodeHTML(w);this.widgets.dataSource.sendRequest(this._buildSearchParams(w),{success:x,failure:y,scope:this});this.widgets.searchButton.set("disabled",true);YAHOO.lang.later(2000,this,function(){if(this.isSearching){if(!this.widgets.feedbackMessage){this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message("message.searching",this.name),spanClass:"wait",displayTime:0})}else{if(!this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.show()}}}},[])}},_enableSearchUI:function k(){if(this.widgets.feedbackMessage&&this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.hide()}this.widgets.searchButton.set("disabled",false);this.isSearching=false},_buildSearchParams:function l(w){return"sortBy=fullName&dir=asc&filter="+encodeURIComponent(w)+"&maxResults="+this.options.maxSearchResults}})})();