(function(){var a=YAHOO.util.Dom,B=YAHOO.util.Event;var u=Alfresco.util.encodeHTML;Alfresco.UserTrashcan=function(C){Alfresco.UserTrashcan.superclass.constructor.call(this,"Alfresco.UserTrashcan",C,["button","container","datasource","datatable","paginator"]);this.searchText="";return this};YAHOO.extend(Alfresco.UserTrashcan,Alfresco.component.Base,{searchText:null,pageSize:50,skipCount:0,onReady:function d(){var D=this;this.widgets.empty=Alfresco.util.createYUIButton(this,"empty-button",this.onEmpty);this.widgets.search=Alfresco.util.createYUIButton(this,"search-button",this.onSearch);this.widgets.clear=Alfresco.util.createYUIButton(this,"clear-button",this.onClear);this.widgets.pageLess=Alfresco.util.createYUIButton(this,"paginator-less-button",this.onPageLess);this.widgets.pageMore=Alfresco.util.createYUIButton(this,"paginator-more-button",this.onPageMore);this.widgets.actionMenu=Alfresco.util.createYUIButton(this,"selected",this.onActionItemClick,{disabled:true,type:"menu",menu:"selectedItems-menu"});this.widgets.selectMenu=Alfresco.util.createYUIButton(this,"select-button",this.onSelectItemClick,{type:"menu",menu:"selectItems-menu"});var D=this;a.get(this.id+"-search-text").onkeypress=function(F){if(F.keyCode===YAHOO.util.KeyListener.KEY.ENTER){D.performSearch()}};var C=Alfresco.constants.PROXY_URI+"api/archive/workspace/SpacesStore";this.widgets.dataTable=new Alfresco.util.DataTable({dataTable:{container:this.id+"-datalist",columnDefinitions:[{key:"select",sortable:false,formatter:this.bind(this.renderCellSelect),width:16},{key:"thumbnail",sortable:false,formatter:this.bind(this.renderCellIcon),width:32},{key:"description",sortable:false,formatter:this.bind(this.renderCellDescription)},{key:"actions",sortable:false,formatter:this.bind(this.renderCellActions),width:250}]},dataSource:{url:C,initialParameters:"maxItems="+(this.pageSize+1),config:{responseSchema:{resultsList:"data.deletedNodes"},doBeforeParseData:function E(G,F){D.widgets.pageLess.set("disabled",((D.skipCount=F.paging.skipCount)===0));if(F.paging.totalItems>D.pageSize){F.data.deletedNodes.pop();D.widgets.pageMore.set("disabled",false)}else{D.widgets.pageMore.set("disabled",true)}return F}}}})},renderCellSelect:function s(E,D,F,G){a.setStyle(E.parentNode,"width",F.width+"px");var C=this;E.innerHTML='<input id="checkbox-'+D.getId()+'" type="checkbox" value="'+D.getData("nodeRef")+'">';E.firstChild.onclick=function(){C._updateSelectedItemsMenu()}},renderCellIcon:function o(F,E,G,H){a.setStyle(F.parentNode,"width",G.width+"px");var C=E.getData("name"),D=E.getData("nodeType");F.innerHTML='<span class="icon32"><img src="'+Alfresco.constants.URL_RESCONTEXT+"components/images/filetypes/"+Alfresco.util.getFileIcon(C,E.getData("isContentType")?"cm:content":D)+'" alt="'+u(C)+'" /></span>'},renderCellDescription:function m(I,L,F,C){var D=L.getData("firstName")+" "+L.getData("lastName");var G=Alfresco.constants.PROXY_URI_RELATIVE+"api/node/content/"+L.getData("nodeRef").replace(":/","")+"/"+encodeURIComponent(L.getData("name"));var H='<a href="'+Alfresco.constants.URL_PAGECONTEXT+"user/"+encodeURI(L.getData("archivedBy"))+'/profile">'+u(D)+"</a>";var K=this.msg("message.metadata",Alfresco.util.formatDate(Alfresco.util.fromISO8601(L.getData("archivedDate"))),H);var J=L.getData("isContentType")?'<a href="'+G+'?a=true">'+u(L.getData("name"))+"</a>":u(L.getData("name"));var E='<div class="name">'+J+'</div><div class="desc">'+K+'</div><div class="desc">'+u(L.getData("displayPath"))+"</div>";I.innerHTML=E},renderCellActions:function b(G,F,H,J){a.setStyle(G.parentNode,"vertical-align","middle");a.setStyle(G.parentNode,"text-align","right");var D=F.getData("nodeRef"),C=F.getData("nodeType"),I=F.getData("name");this._createActionButton(G,D.split("/")[3],"button.recover",function(K,L){if(!this.isRecoverEnabled()){return}this._disableRecover();this.restoringPopup=Alfresco.util.PopupManager.displayMessage({displayTime:0,effect:null,spanClass:"wait",text:E.msg("message.recover.inprogress")});Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.URL_SERVICECONTEXT+"modules/recover-node",dataObj:{name:L.name,nodeType:L.nodeType,nodeRef:L.nodeRef.replace(":/","")},successCallback:{fn:this._onRecoverSuccess,obj:L,scope:this},failureCallback:{fn:this._onRecoverFailure,obj:L,scope:this}})},{nodeRef:D,nodeType:C,name:I});var E=this;this._createActionButton(G,D.split("/")[3],"button.delete",function(K,L){Alfresco.util.PopupManager.displayPrompt({title:E.msg("button.delete"),text:E.msg("message.delete.confirm"),buttons:[{text:E.msg("button.ok"),handler:function(){this.destroy();Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/archive/"+L.nodeRef.replace(":/",""),method:"DELETE",successCallback:{fn:E._onDeleteSuccess,obj:L,scope:E},failureMessage:E.msg("message.delete.failure",I)})}},{text:E.msg("button.cancel"),handler:function(){this.destroy()},isDefault:true}]})},{nodeRef:D,name:I})},_enableRecover:function i(){this._isRecoverEnabled=true},_disableRecover:function p(){this._isRecoverEnabled=false},isRecoverEnabled:function A(){return this._isRecoverEnabled!==false},_onRecoverSuccess:function w(C,D){this.restoringPopup.destroy();this._enableRecover();Alfresco.util.PopupManager.displayMessage({text:this.msg("message.recover.success",D.name)});this.refreshDataTable()},_onRecoverFailure:function k(C,D){this.restoringPopup.destroy();this._enableRecover();Alfresco.util.PopupManager.displayMessage({text:this.msg("message.recover.failure",D.name)});this.refreshDataTable()},_onDeleteSuccess:function f(C,D){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.delete.success",D.name)});this.refreshDataTable()},onActionItemClick:function t(C,I,N){var J=[],D=this.widgets.dataTable.getDataTable(),O=D.getTbodyEl().rows;for(var F=0;F<O.length;F++){if(O[F].cells[0].getElementsByTagName("input")[0].checked){var E=D.getRecord(F);if(E){J.push(E)}}}var K=this;switch(I[1]._oAnchor.className.split(" ")[0]){case"delete-item":Alfresco.util.PopupManager.displayPrompt({title:K.msg("button.delete"),text:K.msg("message.delete.confirm"),buttons:[{text:K.msg("button.ok"),handler:function(){this.destroy();var P=[],S=0;for(var R=0;R<J.length;R++){Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/archive/"+J[R].getData("nodeRef").replace(":/",""),method:"DELETE",failureCallback:{fn:function(){P.push(J[R].getData("name"));S++},obj:J[R],scope:K},successCallback:{fn:function(){S++},obj:J[R],scope:K}})}var Q=function(){if(S===J.length){Alfresco.util.PopupManager.displayPrompt({title:K.msg("message.delete.report"),text:K.msg("message.delete.report-info",(J.length-P.length),P.length)});K.refreshDataTable()}else{setTimeout(Q,500)}};setTimeout(Q,500)}},{text:K.msg("button.cancel"),handler:function(){this.destroy()},isDefault:true}]});break;case"recover-item":var G=[],M=0;if(!K.isRecoverEnabled()){return}K._disableRecover();K.restoringPopup=Alfresco.util.PopupManager.displayMessage({displayTime:0,effect:null,spanClass:"wait",text:K.msg("message.recover.inprogress")});for(var F=0;F<J.length;F++){var H=F;Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/archive/"+J[F].getData("nodeRef").replace(":/",""),method:"PUT",failureCallback:{fn:function(){G.push(J[H].getData("name"));M++},obj:J[F],scope:K},successCallback:{fn:function(){M++},obj:J[F],scope:K}})}var L=function(){if(M===J.length){K.restoringPopup.destroy();K._enableRecover();Alfresco.util.PopupManager.displayPrompt({title:K.msg("message.recover.report"),text:K.msg("message.recover.report-info",(J.length-G.length),G.length)});K.refreshDataTable()}else{setTimeout(L,250)}};setTimeout(L,250);break}},onSelectItemClick:function z(E,D,C){switch(D[1]._oAnchor.className.split(" ")[0]){case"select-all":this._selectAll();break;case"select-invert":this._invertSelection();break;case"select-none":this._deselectAll();break}},_selectAll:function e(){var D=this.widgets.dataTable.getDataTable().getTbodyEl().rows;for(var C=0;C<D.length;C++){D[C].cells[0].getElementsByTagName("input")[0].checked=true}this._updateSelectedItemsMenu()},_deselectAll:function h(){var D=this.widgets.dataTable.getDataTable().getTbodyEl().rows;for(var C=0;C<D.length;C++){D[C].cells[0].getElementsByTagName("input")[0].checked=false}this._updateSelectedItemsMenu()},_invertSelection:function q(){var E=this.widgets.dataTable.getDataTable().getTbodyEl().rows;for(var D=0;D<E.length;D++){var C=E[D].cells[0].getElementsByTagName("input")[0];C.checked=!C.checked}this._updateSelectedItemsMenu()},_updateSelectedItemsMenu:function r(){this.widgets.actionMenu.set("disabled",true);var D=this.widgets.dataTable.getDataTable().getTbodyEl().rows;for(var C=0;C<D.length;C++){if(D[C].cells[0].getElementsByTagName("input")[0].checked){this.widgets.actionMenu.set("disabled",false);break}}},onSearch:function y(C,D){this.performSearch()},onClear:function g(C,D){a.get(this.id+"-search-text").value="";if(this.searchText.length!==0){this.searchText="";this.refreshDataTable()}},onEmpty:function c(E,F){var C=this;Alfresco.util.PopupManager.displayPrompt({title:C.msg("button.empty"),text:C.msg("message.empty.confirm"),buttons:[{text:C.msg("button.ok"),handler:function(){this.destroy();var I=Alfresco.util.PopupManager.displayMessage({displayTime:0,effect:null,text:C.msg("message.empty.inprogress")});Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/archive/workspace/SpacesStore",method:"DELETE",successCallback:{fn:function H(J){I.destroy();C.refreshDataTable()}},failureCallback:{fn:function G(J){I.destroy();Alfresco.util.PopupManager.displayPrompt({text:C.msg("message.recover.failure")})}}})}},{text:C.msg("button.cancel"),handler:function(){this.destroy()},isDefault:true}]});var D=a.getElementsByClassName("yui-button","span","prompt");a.addClass(D[0],"alf-primary-button")},onPageLess:function x(C,D){if(this.skipCount>0){this.skipCount-=this.pageSize}this.refreshDataTable()},onPageMore:function l(C,D){this.skipCount+=this.pageSize;this.refreshDataTable()},_createActionButton:function j(E,J,I,G,H){var F=this;var D=document.createElement("span");D.id=F.id+J;var C=new YAHOO.widget.Button({container:F.id+J});C.set("label",F.msg(I));C.set("onclick",{fn:G,obj:H,scope:F});E.appendChild(D)},performSearch:function n(){this.skipCount=0;var C=YAHOO.lang.trim(a.get(this.id+"-search-text").value);if(C.length!==0){this.searchText=C;this.refreshDataTable()}},refreshDataTable:function v(){var D="maxItems="+(this.pageSize+1)+"&skipCount="+this.skipCount;if(this.searchText.length!==0){var C=this.searchText;if(C.match("\\*")!="*"){C+="*"}D+="&nf="+encodeURIComponent(C)}this.widgets.dataTable.loadDataTable(D)}})})();