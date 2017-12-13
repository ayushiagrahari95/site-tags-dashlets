(function(){var h=YAHOO.util.Dom,l=YAHOO.util.Event;var e=Alfresco.util.encodeHTML,d=function d(o,p){return Alfresco.util.formatDate(Alfresco.util.fromISO8601(o),p)};Alfresco.ConsoleTagManagement=function f(o){Alfresco.ConsoleTagManagement.superclass.constructor.call(this,"Alfresco.ConsoleTagManagement",o,["button","container","datasource","datatable","paginator","history","animation"]);return this};YAHOO.extend(Alfresco.ConsoleTagManagement,Alfresco.component.Base,{options:{pageSize:15},searchTerm:"",resultsCount:0,currentPage:1,onReady:function m(){this._setupDataTable();this.widgets.searchButton=Alfresco.util.createYUIButton(this,"search-button",this.onSearchClick);var o=h.get(this.id+"-search-text");this.widgets.enterListener=new YAHOO.util.KeyListener(o,{keys:YAHOO.util.KeyListener.KEY.ENTER},{fn:this.onSearchClick,scope:this,correctScope:true},"keydown").enable();o.value=this.searchTerm;this._performSearch({searchTerm:this.searchTerm})},_setDefaultDataTableErrors:function g(o){o.set("MSG_EMPTY",this.msg("no-tag-found"))},_setupDataTable:function j(){var y=this;var p=function u(C,B,E,G){var A=B.getData().name;var F;if(A.length>30){F=e(A.substring(0,30)+"...")}else{F=e(A)}var D='<span><a class="theme-color-1" title="'+e(A)+'" href="'+Alfresco.constants.URL_PAGECONTEXT+"repository#filter=tag|"+encodeURIComponent(A)+'&page=1"><b>'+F+"</b></a></span>";C.innerHTML=D};var z=function x(C,B,E,F){var A=B.getData().modifier;var D='<span><a class="theme-color-1" href="'+Alfresco.constants.URL_PAGECONTEXT+"user/"+encodeURIComponent(A)+'/profile">'+e(A)+"</a></span>";C.innerHTML=D};var s=function t(C,B,E,F){var A=B.getData().modified;var D="<span>"+d(A,y.msg("date-format.default"))+"</span>";C.innerHTML=D};var q=function w(F,G,E,A){var I=G.getData();var C="",B,H,D=G._nCount;C+='<a id="'+y.id+"-edit-link-"+D+'" href="#" class="edit-tag" title="'+y.msg("title.editTag")+'">&nbsp;</a>';C+='<a id="'+y.id+"-delete-link-"+D+'" href="#" class="delete-tag" title="'+y.msg("title.deleteTag")+'">&nbsp;</a>';F.innerHTML=C;H=h.getChildrenBy(F,function(J){return J.id===y.id+"-delete-link-"+D})[0];B=h.getChildrenBy(F,function(J){return J.id===y.id+"-edit-link-"+D})[0];l.addListener(G.getId(),"mouseover",function(){h.addClass(H,"delete-tag-active");h.addClass(B,"edit-tag-active")});l.addListener(G.getId(),"mouseout",function(){h.removeClass(H,"delete-tag-active");h.removeClass(B,"edit-tag-active")});l.addListener(H,"click",function(){y.onActionDelete(I.name)},H,false);l.addListener(B,"click",function(){y.onActionEdit(I.name)},B,false)};var o=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/tags/{store_type}/{store_id}?details=true",{store_type:"workspace",store_id:"SpacesStore"});this.widgets.dataSource=new YAHOO.util.DataSource(o);this.widgets.dataSource.responseType=YAHOO.util.DataSource.TYPE_JSON;this.widgets.dataSource.connXhrMode="queueRequests";this.widgets.dataSource.responseSchema={resultsList:"data.items",fields:["name","modifier","modified"],metaFields:{totalRecords:"data.totalRecords"}};this.widgets.paginator=new YAHOO.widget.Paginator({containers:this.id+"-paginator",rowsPerPage:this.options.pageSize,initialPage:1,template:this.msg("pagination.template"),pageReportTemplate:this.msg("pagination.template.page-report"),previousPageLinkLabel:this.msg("pagination.previousPageLinkLabel"),nextPageLinkLabel:this.msg("pagination.nextPageLinkLabel")});var v=[{key:"name",label:y.msg("title.tagName"),sortable:false,formatter:p,width:120},{key:"modifiedBy",label:y.msg("title.modifiedBy"),sortable:false,formatter:z,width:150},{key:"modifiedOn",label:y.msg("title.modifiedOn"),sortable:false,formatter:s,width:150},{key:"action",label:y.msg("title.actions"),sortable:false,formatter:q,width:45}];this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-tags",v,this.widgets.dataSource,{renderLoopSize:Alfresco.util.RENDERLOOPSIZE,initialLoad:false,paginator:this.widgets.paginator,MSG_LOADING:this.msg("loading-tags"),MSG_EMPTY:this.msg("no-tag-found")});this.widgets.dataTable.doBeforeLoadData=function r(B,C,E){if(C.error){try{var A=YAHOO.lang.JSON.parse(C.responseText);y.widgets.dataTable.set("MSG_ERROR",A.message)}catch(D){y._setDefaultDataTableErrors(y.widgets.dataTable);y.widgets.dataTable.render()}}else{if(C.results){y.widgets.dataTable.set("MSG_EMPTY","");y.hasMoreResults=(C.results.length>y.options.maxSearchResults);if(y.hasMoreResults){C.results=C.results.slice(0,y.options.maxSearchResults)}y.resultsCount=C.results.length;if(y.resultsCount>0){h.removeClass(y.id+"-paginator","hidden");h.removeClass(y.id+"-tags-list-bar-bottom","hidden");h.removeClass(y.id+"-tags","hidden");h.addClass(y.id+"-tags-list-info","hidden")}else{h.addClass(y.id+"-paginator","hidden");h.addClass(y.id+"-tags-list-bar-bottom","hidden");h.addClass(y.id+"-tags","hidden");h.get(y.id+"-tags-list-info").innerHTML=y.msg("no-tag-found");h.removeClass(y.id+"-tags-list-info","hidden")}}}return true};this.widgets.paginator.subscribe("changeRequest",function(C,A){var B="&tf="+encodeURIComponent(A.searchTerm)+"&from="+C.recordOffset+"&size="+C.rowsPerPage;A.widgets.dataSource.sendRequest(B,{success:function(D,E,F){A.widgets.dataTable.onDataReturnSetRows.call(A.widgets.dataTable,D,E,F);A.resultsCount=E.meta.totalRecords},failure:this.onRequestFailure,scope:this});A.currentPage=C.page;A.widgets.paginator.setState(C)},this);this.widgets.dataTable.subscribe("renderEvent",function(){y.widgets.paginator.setState({page:y.currentPage,totalRecords:y.resultsCount});y.widgets.paginator.render()})},onSearchClick:function a(q,p){var o=h.get(this.id+"-search-text");this._performSearch({searchTerm:o.value})},onRequestFailure:function b(p,q){if(q.status==401){window.location.reload()}else{try{var o=YAHOO.lang.JSON.parse(q.responseText);this.widgets.dataTable.set("MSG_ERROR",o.message);this.widgets.dataTable.showTableMessage(Alfresco.util.encodeHTML(o.message),YAHOO.widget.DataTable.CLASS_ERROR)}catch(r){this._setDefaultDataTableErrors(this.widgets.dataTable);this.widgets.dataTable.render()}}},_performSearch:function n(p){if(p.searchTerm!=undefined){this.searchTerm=YAHOO.lang.trim(p.searchTerm)}this.widgets.dataTable.deleteRows(0,this.widgets.dataTable.getRecordSet().getLength());this.widgets.dataTable.set("MSG_EMPTY","");this.widgets.dataTable.render();function o(q,r,s){this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,q,r,s);this.resultsCount=r.meta.totalRecords;this.currentPage=1;h.get(this.id+"-search-text").focus()}if(this.searchTerm==""||this.searchTerm=="*"){this.widgets.dataSource.sendRequest("&from=0&size="+this.options.pageSize,{success:o,failure:this.onRequestFailure,scope:this})}else{this.widgets.dataSource.sendRequest("&tf="+encodeURIComponent(this.searchTerm)+"&from=0&size="+this.options.pageSize,{success:o,failure:this.onRequestFailure,scope:this})}},onActionEdit:function k(r){var t=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/tags/{store_type}/{store_id}/{tagName}?alf_method=PUT",{store_type:"workspace",store_id:"SpacesStore",tagName:encodeURIComponent(r)});var p=function o(v){v.addValidation(this.id+"-edit-tag-name",Alfresco.forms.validation.mandatory,null,"keyup")};var q=new Alfresco.module.SimpleDialog(this.id+"-edit-tag");q.setOptions({width:"30em",templateUrl:YAHOO.lang.substitute(Alfresco.constants.URL_PAGECONTEXT+"components/admin/edit-tag?htmlid={id}&tagName={tagName}",{id:this.id+"-edit-tag",tagName:encodeURIComponent(r)}),actionUrl:t,destroyOnHide:true,doSetupFormsValidation:{fn:p,scope:this},onSuccess:{fn:function s(v){if(v.json.result==true){Alfresco.util.PopupManager.displayMessage({text:this.msg(v.json.msg)});this._performSearch({searchTerm:this.searchTerm})}else{Alfresco.util.PopupManager.displayPrompt({title:this.msg("title.error"),text:this.msg(v.json.msg),buttons:[{text:this.msg("button.close"),handler:function w(){this.destroy()}}]})}},scope:this},onFailure:{fn:function u(v){if(v.serverResponse.status===400&&v.json!=undefined&&v.json.result===false){Alfresco.util.PopupManager.displayMessage({text:this.msg(v.json.msg)})}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit.failure")})}},scope:this}}).show()},onActionDelete:function i(q){var r=this;Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.confirm.delete.title"),text:this.msg("message.confirm.delete",q),buttons:[{text:this.msg("button.delete"),handler:function p(){this.destroy();r._onActionDeleteConfirm(q)}},{text:this.msg("button.cancel"),handler:function o(){this.destroy()},isDefault:true}]})},_onActionDeleteConfirm:function c(o){Alfresco.util.Ajax.request({method:Alfresco.util.Ajax.DELETE,url:YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"api/tags/{store_type}/{store_id}/{tagName}",{store_type:"workspace",store_id:"SpacesStore",tagName:encodeURIComponent(o)}),successCallback:{fn:function p(q){Alfresco.util.PopupManager.displayMessage({text:this.msg(q.json.msg)});if(q.json.result==true){this._performSearch({searchTerm:this.searchTerm})}},scope:this},failureMessage:this.msg("message.delete.failure")})}})})();