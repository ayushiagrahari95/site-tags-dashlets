(function(){var f=YAHOO.util.Dom;var x=Alfresco.util.encodeHTML,D=Alfresco.util.siteURL;Alfresco.component.ManagePermissions=function(H){Alfresco.component.ManagePermissions.superclass.constructor.call(this,"Alfresco.component.ManagePermissions",H,["button","menu","container","datasource","datatable","paginator","json"]);YAHOO.Bubbling.on("nodeDetailsAvailable",this.onNodeDetailsAvailable,this);YAHOO.Bubbling.on("itemSelected",this.onAuthoritySelected,this);this.deferredReady=new Alfresco.util.Deferred(["onPermissionsLoaded","onNodeDetailsAvailable"],{fn:this.onDeferredReady,scope:this});this.nodeData=null;this.settableRoles=null;this.settableRolesMenuData=null;this.permissions={isInherited:false,inherited:[],current:[]};this.showingAuthorityFinder=false;this.inheritanceWarning=false;return this};YAHOO.extend(Alfresco.component.ManagePermissions,Alfresco.component.Base,{deferredReady:null,nodeData:null,settableRoles:null,settableRolesMenuData:null,permissions:null,sitePermissions:{},showingAuthorityFinder:null,inheritanceWarning:null,options:{nonEditableNames:["^GROUP_site_.*_SiteManager$"],nonEditableRoles:["SiteManager"],unDeletableRoles:["^GROUP_site_.*_SiteManager$","^GROUP_site_.*_SiteCollaborator$","^GROUP_site_.*_SiteContributor$","^GROUP_site_.*_SiteConsumer$"],showGroups:true,minAuthSearchTermLength:1},onReady:function o(){this.widgets.inherited=Alfresco.util.createYUIButton(this,"inheritedButton",this.onInheritedButton);this.widgets.saveButton=Alfresco.util.createYUIButton(this,"okButton",this.onSaveButton);this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancelButton",this.onCancelButton);this.widgets.rolesTooltip=new Array();this._setupDataSources();this._setupDataTables();Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/people-finder/authority-finder",dataObj:{htmlid:this.id+"-authorityFinder"},successCallback:{fn:this.onAuthorityFinderLoaded,scope:this},failureMessage:this.msg("message.authorityFinderFail"),execScripts:true});if(this.options.site){Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/sites/"+encodeURIComponent(this.options.site)+"/memberships/",successCallback:{fn:function(I){for(var H=0;H<I.json.length;H++){this.sitePermissions[I.json[H].authority.fullName]=I.json[H].role}},scope:this}})}f.setStyle(this.id+"-body","visibility","visible")},onInheritedButton:function w(J,L){var H=this;if(this.permissions.isInherited&&!this.inheritanceWarning){Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.confirm.inheritance.title"),text:this.msg("message.confirm.inheritance.description"),noEscape:true,buttons:[{text:this.msg("button.yes"),handler:function K(){this.destroy();H.inheritanceWarning=true;H.permissions.isInherited=!H.permissions.isInherited;H._updateInheritedUI()}},{text:this.msg("button.no"),handler:function I(){this.destroy()},isDefault:true}]})}else{this.permissions.isInherited=!this.permissions.isInherited;this._updateInheritedUI()}},_updateInheritedUI:function n(){var H=this.permissions.isInherited;f.removeClass(this.id+"-inheritedButtonContainer","inherited-"+(H?"off":"on"));f.addClass(this.id+"-inheritedButtonContainer","inherited-"+(H?"on":"off"));if(H){f.removeClass(this.id+"-inheritedContainer","hidden")}else{f.addClass(this.id+"-inheritedContainer","hidden")}},onAuthorityFinderLoaded:function v(I){var H=f.get(this.id+"-authorityFinder");if(H){H.innerHTML=I.serverResponse.responseText;this.widgets.authorityFinder=H;this.modules.authorityFinder=Alfresco.util.ComponentManager.get(this.id+"-authorityFinder");this.modules.authorityFinder.setOptions({dataWebScript:Alfresco.constants.URL_SERVICECONTEXT+"components/people-finder/authority-query",viewMode:Alfresco.AuthorityFinder.VIEW_MODE_COMPACT,siteId:this.options.site,singleSelectMode:true,minSearchTermLength:this.options.minAuthSearchTermLength,authorityType:(this.options.showGroups)?Alfresco.AuthorityFinder.AUTHORITY_TYPE_ALL:Alfresco.AuthorityFinder.AUTHORITY_TYPE_USERS});this.widgets.addUserGroup=Alfresco.util.createYUIButton(this,"addUserGroupButton",this.onAddUserGroupButton,{label:(this.options.showGroups)?this.msg("button.addUserGroup"):this.msg("button.addUser")});var J=f.getRegion(this.id+"-addUserGroupButton");f.setStyle(this.widgets.authorityFinder,"top",(J.bottom+4)+"px")}Alfresco.util.Ajax.jsonGet({url:Alfresco.constants.PROXY_URI+"slingshot/doclib/permissions/"+Alfresco.util.NodeRef(this.options.nodeRef).uri,successCallback:{fn:this.onPermissionsLoaded,scope:this},failureMessage:this.msg("message.permissionsGetFail")})},onNodeDetailsAvailable:function l(I,H){this.nodeData=H[1].nodeDetails;this.deferredReady.fulfil("onNodeDetailsAvailable")},onPermissionsLoaded:function a(H){var K=H.json;this.permissions={originalIsInherited:K.isInherited,isInherited:K.isInherited,canReadInherited:K.canReadInherited,inherited:K.inherited,original:Alfresco.util.deepCopy(K.direct),current:Alfresco.util.deepCopy(K.direct)};if(!this.permissions.canReadInherited){this.widgets.dtInherited.set("MSG_EMPTY",this.msg("message.empty.no-permission"))}this.inheritanceWarning=!K.isInherited;this.settableRoles=K.settable;this.settableRolesMenuData=[];for(var I=0,J=K.settable.length;I<J;I++){this.settableRoles[K.settable[I]]=true;this.settableRolesMenuData.push({text:K.settable[I],value:K.settable[I]})}this.deferredReady.fulfil("onPermissionsLoaded")},onDeferredReady:function e(){f.get(this.id+"-title").innerHTML=this.msg("title",this.nodeData.displayName);var I=this;var H=function J(M,L){var K=YAHOO.Bubbling.getOwnerByTagName(L[1].anchor,"div");if(K!==null){if(typeof I[K.className]=="function"){L[1].stop=true;var N=I.widgets.dtDirect.getRecord(L[1].target.offsetParent).getData();I[K.className].call(I,N,K)}}return true};YAHOO.Bubbling.addDefaultAction("action-link",H);this.render()},onAddUserGroupButton:function F(I,H){if(!this.showingAuthorityFinder){this.modules.authorityFinder.clearResults();f.addClass(this.widgets.authorityFinder,"active");f.addClass(this.id+"-inheritedContainer","table-mask");f.addClass(this.id+"-directContainer","table-mask");f.get(this.id+"-authorityFinder-search-text").focus();this.showingAuthorityFinder=true}else{f.removeClass(this.widgets.authorityFinder,"active");f.removeClass(this.id+"-inheritedContainer","table-mask");f.removeClass(this.id+"-directContainer","table-mask");this.showingAuthorityFinder=false}},onAuthoritySelected:function r(J,H){var I=this.sitePermissions[H[1].itemName];if(I==null){I=this.settableRoles[this.settableRoles.length-1]}this.permissions.current.push({authority:{name:H[1].itemName,displayName:H[1].displayName,iconUrl:H[1].iconUrl},role:I,created:true});this.widgets.addUserGroup.set("checked",false);f.removeClass(this.widgets.authorityFinder,"active");f.removeClass(this.id+"-inheritedContainer","table-mask");f.removeClass(this.id+"-directContainer","table-mask");this.showingAuthorityFinder=false;this.render()},fnRenderCellAuthorityIcon:function z(){var I=this;return function H(L,K,N,P){f.setStyle(L,"width",N.width+"px");f.setStyle(L.parentNode,"width",N.width+"px");var M=K.getData("authority"),O=M.name.indexOf("GROUP_")===0,J=Alfresco.constants.URL_RESCONTEXT+"components/images/"+(O?"group":"no-user-photo")+"-64.png";if(M.avatar&&M.avatar.length!==0){J=Alfresco.constants.PROXY_URI+M.avatar+"?c=queue&ph=true"}else{if(M.iconUrl){J=M.iconUrl}}L.innerHTML='<img class="icon32" src="'+J+'" alt="icon" />'}},fnRenderCellText:function h(){var H=this;return function I(K,J,L,M){f.setStyle(K,"width",L.width+"px");f.setStyle(K.parentNode,"width",L.width+"px");K.innerHTML=x(M)}},fnRenderPermissionCellText:function B(){var H=this;return function I(K,J,L,M){K.innerHTML=x(M)}},_i18nRole:function k(H){return this.msg("roles."+H.toLowerCase())},fnRenderCellRoleText:function d(K,J,L,M){var I=this;return function H(O,N,P,Q){arguments[3]=I._i18nRole(arguments[3]);I.fnRenderCellText().apply(I,arguments)}},fnRenderCellRole:function u(){var H=this;return function I(S,T,P,J){f.setStyle(S,"width",P.width+"px");f.setStyle(S.parentNode,"width",P.width+"px");var M=T.getData("role"),Q=T.getData("index"),R="roles-"+T.getId(),O=[];if(!H._isGroupEditable(T)||!H.settableRoles.hasOwnProperty(M)){S.innerHTML="<span>"+x(H._i18nRole(T.getData("role")))+"</span>"}else{O=O.concat(H.settableRolesMenuData);for(var L=0,N=O.length;L<N;L++){O[L].text=H._i18nRole(O[L].value)}S.innerHTML='<span id="'+R+'"></span>';var K=new YAHOO.widget.Button({container:R,type:"menu",menu:O});K.getMenu().subscribe("click",function(V,U){return function W(Z,Y){var X=U[1];if(X){Z.set("label",H._i18nRole(X.value));H.onRoleChanged.call(H,U[1],Y)}}(K,Q)});K.set("label",x(H._i18nRole(T.getData("role"))))}}},fnRenderCellActions:function m(){var H=this;return function I(L,K,M,O){var N=K.getData("role");f.setStyle(L,"width",M.width+"px");f.setStyle(L.parentNode,"width",M.width+"px");var J='<div id="'+H.id+"-actions-"+K.getId()+'" class="hidden action-set">';if(H._isGroupEditable(K)&&H._isGroupDeletable(K)){J+='<div class="onActionDelete"><a class="action-link" title="'+H.msg("button.delete")+'"><span>'+H.msg("button.delete")+"</span></a></div>"}J+="</div>";L.innerHTML=J}},render:function j(){this._updateInheritedUI();this.widgets.dsInherited.sendRequest(this.permissions.inherited,{success:this.widgets.dtInherited.onDataReturnInitializeTable,failure:this.widgets.dtInherited.onDataReturnInitializeTable,scope:this.widgets.dtInherited});this.widgets.dsDirect.sendRequest(this.permissions.current,{success:this.widgets.dtDirect.onDataReturnInitializeTable,failure:this.widgets.dtDirect.onDataReturnInitializeTable,scope:this.widgets.dtDirect})},generateData:function i(L){var M=[],K;for(var I=0,J=L.length;I<J;I++){K=L[I];if(!K.removed&&!(K.authority.name==="GROUP_EVERYONE"&&K.role==="ReadPermissions")){M.push({index:I,authority:K.authority,displayName:K.authority.displayName,isGroup:K.authority.name.indexOf("GROUP_")==0,role:K.role})}}function H(O,N){return(!O.isGroup&&N.isGroup)?1:(O.isGroup&&!N.isGroup)?-1:(O.displayName>N.displayName)?1:(O.displayName<N.displayName)?-1:0}return M.sort(H)},_setupDataSources:function p(){this.widgets.dsInherited=new YAHOO.util.DataSource(this.generateData,{responseType:YAHOO.util.DataSource.TYPE_JSFUNCTION,scope:this});this.widgets.dsDirect=new YAHOO.util.DataSource(this.generateData,{responseType:YAHOO.util.DataSource.TYPE_JSFUNCTION,scope:this})},_setupDataTables:function c(){var H=(this.options.showGroups)?this.msg("column.authority"):this.msg("column.user");var I=[{key:"icon",label:"",sortable:false,formatter:this.fnRenderCellAuthorityIcon(),width:32},{key:"displayName",label:H,sortable:false,formatter:this.fnRenderPermissionCellText()},{key:"role",label:this.msg("column.role"),sortable:false,formatter:this.fnRenderCellRoleText(),width:240}];this.widgets.dtInherited=new YAHOO.widget.DataTable(this.id+"-inheritedPermissions",I,this.widgets.dsInherited,{initialLoad:false,MSG_EMPTY:this.msg("message.empty"),MSG_LOADING:this.msg("message.loading")});I=[{key:"icon",label:"",sortable:false,formatter:this.fnRenderCellAuthorityIcon(),width:32},{key:"displayName",label:H,sortable:false,formatter:this.fnRenderPermissionCellText()},{key:"role",label:this.msg("column.role"),sortable:false,formatter:this.fnRenderCellRole(),width:240},{key:"actions",label:this.msg("column.actions"),sortable:false,formatter:this.fnRenderCellActions(),width:120}];this.widgets.dtDirect=new YAHOO.widget.DataTable(this.id+"-directPermissions",I,this.widgets.dsDirect,{initialLoad:false,MSG_EMPTY:this.msg("message.empty"),MSG_LOADING:this.msg("message.loading")});this.widgets.dtDirect.subscribe("rowMouseoverEvent",this.onEventHighlightRow,this,true);this.widgets.dtDirect.subscribe("rowMouseoutEvent",this.onEventUnhighlightRow,this,true);this._injectRoleTooltip(this.id+"-inheritedPermissions","-role");this._injectRoleTooltip(this.id+"-directPermissions","-role")},_injectRoleTooltip:function b(K,J){var M=f.getElementsBy(function(O){return O.id.indexOf(J)>0},"th",K);if(M.length>0){var I=this.widgets.rolesTooltip.length;var L=this.id+"-role-info"+I;var N=document.createElement("div");N.id=L;N.className="alf-role-info-tooltip";var H="role-info-button"+I;N.innerHTML='<button id="'+this.id+"-"+H+'">&nbsp;</button>';M[0].children[0].children[0].className+=" alf-role-column-label";M[0].children[0].appendChild(N);this.widgets.rolesTooltip.push(new Alfresco.module.RolesTooltip(this.id,L,H,this.options.site,this.options.nodeRef));return this.widgets.rolesTooltip}return null},_isGroupEditable:function C(K){if(this.permissions.isInherited){return true}var L=K.getData("authority").name;var J=K.getData("role");if(K.getData("isGroup")==true){for(var I=0;I<this.options.nonEditableNames.length;I++){if(L.search(this.options.nonEditableNames[I])!==-1){for(var H=0;H<this.options.nonEditableRoles.length;H++){if(J.search(this.options.nonEditableRoles[H])!==-1){return false}}}}}return true},_isGroupDeletable:function G(I){if(this.permissions.isInherited){return true}if(Alfresco.constants.SITE!=null&&Alfresco.constants.SITE.length>0){return true}if(Alfresco.constants.SITE!=null&&Alfresco.constants.SITE.length>0){return true}var J=I.getData("authority").name;if(I.getData("isGroup")==true){for(var H=0;H<this.options.unDeletableRoles.length;H++){if(J.search(this.options.unDeletableRoles[H])!==-1){return false}}}return true},onEventHighlightRow:function t(H){this.widgets.dtDirect.onEventHighlightRow.call(this.widgets.dtDirect,H);f.removeClass(this.id+"-actions-"+H.target.id,"hidden")},onEventUnhighlightRow:function A(H){this.widgets.dtDirect.onEventUnhighlightRow.call(this.widgets.dtDirect,H);f.addClass(this.id+"-actions-"+H.target.id,"hidden")},onRoleChanged:function q(K,J){var I=this.permissions.current[J],H=this.permissions.original;I.role=K.value;I.modified=(J<=H.length&&H[J]!=null&&I.role!==H[J].role)},onActionDelete:function y(I){var H=this.permissions.current[I.index];H.removed=true;this.render()},onSaveButton:function g(M,H){this.widgets.saveButton.set("disabled",true);var L=[],K;for(var I=0,J=this.permissions.current.length;I<J;I++){K=this.permissions.current[I];if((K.created&&!K.removed)||(!K.created&&(K.removed||K.modified))){L.push({authority:K.authority.name,role:K.role,remove:K.removed});if(K.modified&&!K.created){L.push({authority:K.authority.name,role:this.permissions.original[I].role,remove:true})}}}if(L.length>0||this.permissions.isInherited!==this.permissions.originalIsInherited){Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"slingshot/doclib/permissions/"+Alfresco.util.NodeRef(this.options.nodeRef).uri,dataObj:{permissions:L,isInherited:this.permissions.isInherited},successCallback:{fn:function(N){this._navigateForward()},scope:this},failureCallback:{fn:function(N){var O=Alfresco.util.parseJSON(N.serverResponse.responseText);Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.failure"),text:this.msg("message.permissionsSaveFail",O.message)});this.widgets.saveButton.set("disabled",false)},scope:this}})}else{this._navigateForward()}},onCancelButton:function s(I,H){this.widgets.cancelButton.set("disabled",true);this._navigateForward()},_navigateForward:function E(){window.history.go(-1)}})})();