Alfresco.WebPreview.prototype.Plugins.Flash=function(b,a){this.wp=b;this.attributes=YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes),a);this.swfDiv=null;return this};Alfresco.WebPreview.prototype.Plugins.Flash.prototype={attributes:{src:null,version:null},report:function Flash_report(){var a=this.attributes.version?this.attributes.version.split("."):null;if(!a||!a.length==3||!Alfresco.util.hasRequiredFlashPlayer.apply(Alfresco.util,a)){return this.wp.msg("label.noFlash")}},display:function Flash_display(){var b=this.attributes.src?this.wp.getThumbnailUrl(this.attributes.src):this.wp.getContentUrl();var a="Flash_"+this.wp.id;var c=new YAHOO.deconcept.SWFObject(b,a,"100%","100%",this.attributes.version);c.addParam("allowScriptAccess","never");c.addParam("allowNetworking","none");c.addParam("allowFullScreen","false");c.addParam("wmode","opaque");c.write(this.wp.widgets.previewerElement.id)}};