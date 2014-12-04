define("warm-it-up-ember/adapters/application",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ActiveModelAdapter.extend({namespace:"api/v1"})}),define("warm-it-up-ember/app",["ember","ember/resolver","ember/load-initializers","warm-it-up-ember/config/environment","exports"],function(e,t,s,n,r){"use strict";var a=e["default"],o=t["default"],i=s["default"],u=n["default"];a.MODEL_FACTORY_INJECTIONS=!0;var l=a.Application.extend({modulePrefix:u.modulePrefix,podModulePrefix:u.podModulePrefix,Resolver:o});i(l,u.modulePrefix),r["default"]=l}),define("warm-it-up-ember/components/code-box",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({content:function(e,t){if(!this.editor)return this.preset=t,t;if(1===arguments.length)return this.editor.getSession().getValue();var s=this.editor.getCursorPosition();return this.editor.getSession().setValue(t),this.editor.moveCursorToPosition(s),t}.property(),didInsertElement:function(){this.editor=window.ace.edit("editor"),this.editor.setTheme("ace/theme/monokai"),this.editor.getSession().setMode("ace/mode/ruby");var e=this;this.editor.on("change",function(){e.notifyPropertyChange("content")}),this.preset&&(this.set("content",this.preset),this.preset=null)},actions:{createSolution:function(){this.sendAction("submit",this.editor.getValue())},run:function(){var e=this.get("answer"),t=this.editor.getValue();$.ajax({type:"GET",url:"api/v1/coderunner",data:{code:t},dataType:"jsonp"}).done(function(t){var s=t;alert(s===e?"success!":"you're wrong!")}).fail(function(){alert("error")})}}})}),define("warm-it-up-ember/components/navbar-box",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({problemNumber:function(){var e=new Date(2014,10,1),t=Date.now(),s=t-e,n=864e5,r=Math.floor(s/n);return r}.property()})}),define("warm-it-up-ember/components/solution-box",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({isEnabled:!1,sortAscending:!0,sortProperties:["points_earned"],needs:["application"],wasLiked:function(){var e=this.get("currentUser"),t=this.get("solution"),s=t.get("votes"),n=s.content.map(function(e){return e._data.user_id});return n.some(function(t){return t===e.id})}.property("currentUser"),actions:{show:function(){this.toggleProperty("isEnabled"),this.isEnabled?(this.$(".show").addClass("clicked"),this.$("pre").removeClass("hidden")):(this.$(".show").removeClass("clicked"),this.$("pre").addClass("hidden"))},addLike:function(e){this.sendAction("like",e),this.set("wasLiked",!0)},removeLike:function(e){this.sendAction("unlike",e),this.set("wasLiked",!1)}}})}),define("warm-it-up-ember/components/solution-update",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Component.extend({})}),define("warm-it-up-ember/controllers/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Controller.extend({currentUser:""})}),define("warm-it-up-ember/controllers/poss",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({needs:"posses/index",styledPointPercentage:function(){return"width:"+this.get("pointPercentage")+"%"}.property("styledPointPercentage"),pointPercentage:function(){var e=this.get("controllers.posses/index").get("highestScore"),t=parseInt(this.get("scores")),s=t/e*100;return s}.property("pointPercentage")})}),define("warm-it-up-ember/controllers/posses/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({sortProperties:["scores"],sortAscending:!0,highestScore:function(){var e=this.get("sortedPosses"),t=e.get("firstObject");return t.get("scores")}.property("highestScores","sortedPosses"),sortedPosses:function(){var e=this.get("poss"),t=e.sortBy("scores").reverse();return t}.property("sortedPosse"),todaysProblem:function(){var e=new Date(2014,10,1),t=Date.now(),s=t-e,n=864e5,r=Math.floor(s/n);return r}.property("todaysProblem"),currentSolutions:function(){var e=this.get("todaysProblem"),t=this.get("solution"),s=t.filter(function(t){var s=parseInt(t._data.problem.id);return s===e?!0:void 0}),n=s.sortBy("created_at").reverse();return n}.property("currentSolutions")})}),define("warm-it-up-ember/controllers/problems/show",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({needs:["application"],actions:{createSolution:function(e){var t=function(){var e=new Date,t=(new Date).setHours(8,30,0,0),s=(e-t)/1e3;return parseInt(2e3-s,10)>0?parseInt(2200-s,10):200},s=this.store.createRecord("solution",{content:e,posse_id:this.get("controllers.application.currentUser.posse_id"),problem:this.get("model"),points_earned:t()}),n=this;s.get("posse_id")?s.save().then(function(){n.transitionToRoute("solutions")}):alert("Go log in, chum")}}})}),define("warm-it-up-ember/controllers/solutions/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ArrayController.extend({needs:["application"],todaysProblem:function(){var e=new Date(2014,10,1),t=Date.now(),s=t-e,n=864e5,r=Math.floor(s/n);return r}.property("todaysProblem"),currentSolutions:function(){var e=this.get("todaysProblem"),t=this.get("model"),s=t.filter(function(t){var s=parseInt(t._data.problem.id);return s===e?!0:void 0}),n=s.sort(function(e,t){return e.points_earned-t.points_earned});return n}.property("model.@each"),actions:{addLike:function(e){var t=this.get("controllers.application.currentUser"),s=e.get("votes"),n=s.content.map(function(e){return e._data.user_id}),r=n.some(function(e){return e===t.id});if(r)alert("you cant");else{var a=this.store.createRecord("vote",{solution:e});a.save()}},removeLike:function(e){var t=this.get("controllers.application.currentUser"),s=e.get("votes"),n=s.find(function(e){return e._data.user_id===t.id?!0:void 0});n.deleteRecord(),n.save()}}})}),define("warm-it-up-ember/controllers/solutions/show",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.ObjectController.extend({})}),define("warm-it-up-ember/helpers/today-link",[],function(){"use strict"}),define("warm-it-up-ember/initializers/export-application-global",["ember","warm-it-up-ember/config/environment","exports"],function(e,t,s){"use strict";function n(e,t){var s=r.String.classify(a.modulePrefix);a.exportApplicationGlobal&&(window[s]=t)}var r=e["default"],a=t["default"];s.initialize=n,s["default"]={name:"export-application-global",initialize:n}}),define("warm-it-up-ember/models/poss",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Model.extend({name:s.attr("string"),scores:s.attr("number"),imageUrl:s.attr("string")})}),define("warm-it-up-ember/models/problem",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Model.extend({content:s.attr("string"),answer:s.attr("string"),solutions:s.hasMany("solution",{async:!0})})}),define("warm-it-up-ember/models/solution",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Model.extend({posse_id:s.attr("string"),problem_id:s.attr("string"),content:s.attr("string"),points_earned:s.attr("string"),created_at:s.attr("string"),votes:s.hasMany("vote"),posse:s.attr("string"),problem:s.belongsTo("problem"),posse_image:s.attr("string"),upvoteCount:function(){return this.get("votes.length")}.property("votes.length")})}),define("warm-it-up-ember/models/user",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Model.extend({name:s.attr("string"),uid:s.attr("string"),posse_id:s.attr("string")})}),define("warm-it-up-ember/models/vote",["ember-data","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Model.extend({solution:s.belongsTo("solution")})}),define("warm-it-up-ember/navbar_view",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.View.extend({templateName:"partials/navbar",targetUrl:"http://turing.io"})}),define("warm-it-up-ember/router",["ember","warm-it-up-ember/config/environment","exports"],function(e,t,s){"use strict";var n=e["default"],r=t["default"],a=n.Router.extend({location:r.locationType});a.map(function(){this.resource("posses",{path:"/"},function(){this.route("show",{path:":poss_id"})}),this.resource("problems",function(){this.route("show",{path:":problem_id"})}),this.resource("solutions",function(){this.route("show",{path:":solution_id"}),this.route("create",{path:"create"})}),this.resource("users",function(){this.route("user",{path:":user_id"})})}),s["default"]=a}),define("warm-it-up-ember/routes/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({setupController:function(e){$.getJSON("api/v1/users/current",function(t){e.set("currentUser",t.user)})}})}),define("warm-it-up-ember/routes/posses/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return s.RSVP.hash({poss:this.store.find("poss"),solution:this.store.find("solution")})}})}),define("warm-it-up-ember/routes/problems/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.find("problem")}})}),define("warm-it-up-ember/routes/solutions/create",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({beforeModel:function(){if(this.controllFor("application").get("currentUser")){var e=$.get("/session");return e}}})}),define("warm-it-up-ember/routes/solutions/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.find("solution")}})}),define("warm-it-up-ember/routes/user",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(e){return this.store.find("user",e.user_id)}})}),define("warm-it-up-ember/routes/users",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Route.extend({model:function(){return this.store.find("user")}})}),define("warm-it-up-ember/templates/application",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var o,i,u,l="",p=n.helperMissing,h=this.escapeExpression;return a.buffer.push(h((i=n["navbar-box"]||t&&t["navbar-box"],u={hash:{currentUser:"currentUser"},hashTypes:{currentUser:"ID"},hashContexts:{currentUser:t},contexts:[],types:[],data:a},i?i.call(t,u):p.call(t,"navbar-box",u)))),a.buffer.push("\n"),o=n._triageMustache.call(t,"outlet",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(o||0===o)&&a.buffer.push(o),a.buffer.push("\n"),l})}),define("warm-it-up-ember/templates/components/code-box",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var o="",i=this.escapeExpression;return a.buffer.push("<pre id='editor'></pre>\n<button "),a.buffer.push(i(n.action.call(t,"run",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:a}))),a.buffer.push(' class="btn btn-default">Run</button>\n<button '),a.buffer.push(i(n.action.call(t,"createSolution",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:a}))),a.buffer.push(' class="btn btn-default">Submit</button>\n'),o})}),define("warm-it-up-ember/templates/components/navbar-box",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){t.buffer.push("\n          <li>\n            <a href='/' onClick=\"window.open('http://192.241.154.25/auth/github', '_blank')\">Sign In with Github</a>\n          </li>\n        ")}function i(e,t){var s,r="";return t.buffer.push("\n          <li>\n          Welcome "),s=n._triageMustache.call(e,"currentUser.name",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n          </li>\n          <li>\n            <a href='http://192.241.154.25/signout'>Sign Out</a>\n          </li>\n        "),r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var u,l,p,h="",c=n.helperMissing,d=this.escapeExpression,f=this;return a.buffer.push('<header class="mod-header">\n  <div class="layout-wrap">\n    <h1>\n      <a href="http://turing.io">Turing School of Software & Design</a>\n    </h1>\n    <nav>\n      <ul>\n        <li>\n          '),a.buffer.push(d((l=n["link-to"]||t&&t["link-to"],p={hash:{},hashTypes:{},hashContexts:{},contexts:[t,t,t],types:["STRING","STRING","ID"],data:a},l?l.call(t,"Today's Problem","problems.show","problemNumber",p):c.call(t,"link-to","Today's Problem","problems.show","problemNumber",p)))),a.buffer.push("\n        </li>\n        <li>\n          "),a.buffer.push(d((l=n["link-to"]||t&&t["link-to"],p={hash:{},hashTypes:{},hashContexts:{},contexts:[t,t],types:["STRING","STRING"],data:a},l?l.call(t,"Solutions","solutions",p):c.call(t,"link-to","Solutions","solutions",p)))),a.buffer.push("\n        </li>\n        <li>\n          "),a.buffer.push(d((l=n["link-to"]||t&&t["link-to"],p={hash:{},hashTypes:{},hashContexts:{},contexts:[t,t],types:["STRING","STRING"],data:a},l?l.call(t,"Scores","posses.index",p):c.call(t,"link-to","Scores","posses.index",p)))),a.buffer.push("\n        </li>\n        "),u=n.unless.call(t,"currentUser",{hash:{},hashTypes:{},hashContexts:{},inverse:f.program(3,i,a),fn:f.program(1,o,a),contexts:[t],types:["ID"],data:a}),(u||0===u)&&a.buffer.push(u),a.buffer.push("\n      </ul>\n    </nav>\n  </div>\n</header>\n"),h})}),define("warm-it-up-ember/templates/components/solution-box",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){var s="";return t.buffer.push('\n        <button class="solution-buttons like" '),t.buffer.push(p(n.action.call(e,"removeLike","solution",{hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t}))),t.buffer.push(">Unlike</button>\n      "),s}function i(e,t){var s="";return t.buffer.push('\n        <button class="solution-buttons like" '),t.buffer.push(p(n.action.call(e,"addLike","solution",{hash:{},hashTypes:{},hashContexts:{},contexts:[e,e],types:["STRING","ID"],data:t}))),t.buffer.push(">Like</button>\n      "),s}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var u,l="",p=this.escapeExpression,h=this;return a.buffer.push(' <div class="box">\n    <div class="solution-box-left" '),a.buffer.push(p(n["bind-attr"].call(t,{hash:{"class":"isEnabled:enabled:disabled"},hashTypes:{"class":"STRING"},hashContexts:{"class":t},contexts:[],types:[],data:a}))),a.buffer.push('>\n      <img class="circular" '),a.buffer.push(p(n["bind-attr"].call(t,{hash:{src:"solution.posse_image"},hashTypes:{src:"ID"},hashContexts:{src:t},contexts:[],types:[],data:a}))),a.buffer.push(' height="80px" width="80px">\n      <span class="solution-name">'),u=n._triageMustache.call(t,"solution.posse",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(u||0===u)&&a.buffer.push(u),a.buffer.push('</span><br/>\n    </div>\n    <div class="solution-box-right">\n      <span class="point_adjust">'),u=n._triageMustache.call(t,"solution.upvoteCount",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(u||0===u)&&a.buffer.push(u),a.buffer.push('</span>\n      <span class="update-title"> likes</span>\n      <span class="point-adjust">'),u=n._triageMustache.call(t,"solution.points_earned",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(u||0===u)&&a.buffer.push(u),a.buffer.push('</span>\n      <span class="update-title"> points</span>\n      <button class="solution-buttons show" '),a.buffer.push(p(n.action.call(t,"show",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:a}))),a.buffer.push(">Show</button>\n      "),u=n["if"].call(t,"wasLiked",{hash:{},hashTypes:{},hashContexts:{},inverse:h.program(3,i,a),fn:h.program(1,o,a),contexts:[t],types:["ID"],data:a}),(u||0===u)&&a.buffer.push(u),a.buffer.push('\n    </div>\n    <pre class="hidden solution">'),u=n._triageMustache.call(t,"solution.content",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(u||0===u)&&a.buffer.push(u),a.buffer.push("</pre>\n  </div>\n"),l})}),define("warm-it-up-ember/templates/components/solution-updates",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){var s,r="";return t.buffer.push('\n  <div class="box">\n    <div class="update-box-left">\n      <img class="circular" '),t.buffer.push(l(n["bind-attr"].call(e,{hash:{src:"solution.posse_image"},hashTypes:{src:"ID"},hashContexts:{src:e},contexts:[],types:[],data:t}))),t.buffer.push(' height="80px" width="80px">\n      <span class="update-name">'),s=n._triageMustache.call(e,"solution.posse",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push('</span><br/>\n    </div>\n    <div class="update-box-right">\n      <span class="point-adjust">+'),s=n._triageMustache.call(e,"solution.points_earned",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push('</span>\n      <span class="update-title">points earned</span>\n    </div>\n  </div>\n'),r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var i,u="",l=this.escapeExpression,p=this;return i=n.each.call(t,"solution","in","solution",{hash:{},hashTypes:{},hashContexts:{},inverse:p.noop,fn:p.program(1,o,a),contexts:[t,t,t],types:["ID","ID","ID"],data:a}),(i||0===i)&&a.buffer.push(i),a.buffer.push("\n"),u})}),define("warm-it-up-ember/templates/posses/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){var s,r="";return t.buffer.push("\n      "),s=n["with"].call(e,"poss",{hash:{},hashTypes:{},hashContexts:{},inverse:f.noop,fn:f.program(2,i,t),contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n      "),r}function i(e,t){var s,r,a,o="";return t.buffer.push('\n      <div class="box">\n        <div class="posse-box-left">\n          <img class="circular"'),t.buffer.push(c(n["bind-attr"].call(e,{hash:{src:"imageUrl"},hashTypes:{src:"ID"},hashContexts:{src:e},contexts:[],types:[],data:t}))),t.buffer.push(' height="80px" width="80px">\n          <span class="posse-name">'),s=n._triageMustache.call(e,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push('</span>\n        </div>\n        <div class="posse-box-right">\n          <div class="progress">\n            <div class="progress-bar progress-bar-turing" '),t.buffer.push(c((r=n["bind-Attr"]||e&&e["bind-Attr"],a={hash:{style:"styledPointPercentage"},hashTypes:{style:"ID"},hashContexts:{style:e},contexts:[],types:[],data:t},r?r.call(e,a):d.call(e,"bind-Attr",a)))),t.buffer.push('>\n              <span class="sr-only">'),s=n._triageMustache.call(e,"pointPercentage",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("% Complete</span>\n              "),s=n._triageMustache.call(e,"scores",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("\n            </div>\n          </div>\n        </div>\n      </div>\n      "),o}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var u,l,p,h="",c=this.escapeExpression,d=n.helperMissing,f=this;return a.buffer.push('<div class="col-md-4">\n</div>\n<div class="col-md-8">\n  <div class="countdown-wrapper">\n    <div class="clock"></div>\n  </div>\n</div>\n<div class="mod-scores">\n  <div class="col-md-6">\n    <h2>Leaderboard</h2>\n    <div class="col-sm-12 leaderboard">\n      '),u=n.each.call(t,"poss","in","sortedPosses",{hash:{itemController:"poss"},hashTypes:{itemController:"STRING"},hashContexts:{itemController:t},inverse:f.noop,fn:f.program(1,o,a),contexts:[t,t,t],types:["ID","ID","ID"],data:a}),(u||0===u)&&a.buffer.push(u),a.buffer.push('\n    </div>\n  </div>\n  <div class="col-md-6">\n    <h2>Updates</h2>\n    <div class="col-sm-12 updates">\n      '),a.buffer.push(c((l=n["solution-updates"]||t&&t["solution-updates"],p={hash:{solution:"currentSolutions",imageUrl:"imageUrl"},hashTypes:{solution:"ID",imageUrl:"ID"},hashContexts:{solution:t,imageUrl:t},contexts:[],types:[],data:a},l?l.call(t,p):d.call(t,"solution-updates",p)))),a.buffer.push("\n    </div>\n  </div>\n  </div>\n</div>\n"),h})}),define("warm-it-up-ember/templates/problems/show",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var o,i,u,l="",p=n.helperMissing,h=this.escapeExpression;return a.buffer.push('<div class="mod-problems">\n  <div class="col-md-6 col-problem">\n    <h1>Problem</h1>\n    <div class="box">\n      <p id="problem">'),o=n._triageMustache.call(t,"model.content",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(o||0===o)&&a.buffer.push(o),a.buffer.push('</p>\n    </div>\n  </div>\n  <div class="col-md-6 col-solution">\n    <h1>Solution</h1>\n    '),a.buffer.push(h((i=n["code-box"]||t&&t["code-box"],u={hash:{answer:"model.answer",submit:"createSolution"},hashTypes:{answer:"ID",submit:"STRING"},hashContexts:{answer:t,submit:t},contexts:[],types:[],data:a},i?i.call(t,u):p.call(t,"code-box",u)))),a.buffer.push("\n  </div>\n</div>\n"),l})}),define("warm-it-up-ember/templates/solutions/create",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var o,i,u="",l=n.helperMissing,p=this.escapeExpression;return a.buffer.push('<h4>Submit Your Solution</h4>\n<div class="row">\n  <div class="col-md-4 col-md-offset-4">\n    <div class="form-horizontal">\n      <div class="form-group">\n        '),a.buffer.push(p((o=n.input||t&&t.input,i={hash:{value:"posse_id",placeholder:"Posse ID","class":"form-control"},hashTypes:{value:"ID",placeholder:"STRING","class":"STRING"},hashContexts:{value:t,placeholder:t,"class":t},contexts:[],types:[],data:a},o?o.call(t,i):l.call(t,"input",i)))),a.buffer.push('\n      </div>\n      <div class="form-group">\n        '),a.buffer.push(p((o=n.input||t&&t.input,i={hash:{value:"problem_id",placeholder:"Problem ID","class":"form-control"},hashTypes:{value:"ID",placeholder:"STRING","class":"STRING"},hashContexts:{value:t,placeholder:t,"class":t},contexts:[],types:[],data:a},o?o.call(t,i):l.call(t,"input",i)))),a.buffer.push('\n      </div>\n      <div class="form-group">\n        '),a.buffer.push(p((o=n.input||t&&t.input,i={hash:{value:"model.content",placeholder:"Content","class":"form-control"},hashTypes:{value:"ID",placeholder:"STRING","class":"STRING"},hashContexts:{value:t,placeholder:t,"class":t},contexts:[],types:[],data:a},o?o.call(t,i):l.call(t,"input",i)))),a.buffer.push("\n      </div>\n      <a type='submit' "),a.buffer.push(p(n.action.call(t,"create",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["STRING"],data:a}))),a.buffer.push(">Submit</a>\n    </div>\n  </div>\n</div>"),u})}),define("warm-it-up-ember/templates/solutions/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){var s,r,a="";return t.buffer.push("\n          "),t.buffer.push(p((s=n["solution-box"]||e&&e["solution-box"],r={hash:{solution:"solution",unlike:"removeLike",like:"addLike",currentUser:"controllers.application.currentUser"},hashTypes:{solution:"ID",unlike:"STRING",like:"STRING",currentUser:"ID"},hashContexts:{solution:e,unlike:e,like:e,currentUser:e},contexts:[],types:[],data:t},s?s.call(e,r):l.call(e,"solution-box",r)))),t.buffer.push("\n        "),a}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var i,u="",l=n.helperMissing,p=this.escapeExpression,h=this;return a.buffer.push('<div class="mod-scores">\n  <div class="col-md-12">\n    <h2>Solutions</h2>\n      <div class="col-sm-1"></div>\n      <div class="col-sm-10 solutions">\n        '),i=n.each.call(t,"solution","in","currentSolutions",{hash:{},hashTypes:{},hashContexts:{},inverse:h.noop,fn:h.program(1,o,a),contexts:[t,t,t],types:["ID","ID","ID"],data:a}),(i||0===i)&&a.buffer.push(i),a.buffer.push("\n      </div>\n    </div>\n  </div>\n</div>\n"),u})}),define("warm-it-up-ember/templates/solutions/show",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var o,i="";return a.buffer.push("<h3>Your Answer</h3>\n  "),o=n._triageMustache.call(t,"posse_id",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(o||0===o)&&a.buffer.push(o),a.buffer.push("\n  "),o=n._triageMustache.call(t,"problem_id",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(o||0===o)&&a.buffer.push(o),a.buffer.push("\n  "),o=n._triageMustache.call(t,"model.content",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(o||0===o)&&a.buffer.push(o),a.buffer.push("\n  "),o=n._triageMustache.call(t,"points_earned",{hash:{},hashTypes:{},hashContexts:{},contexts:[t],types:["ID"],data:a}),(o||0===o)&&a.buffer.push(o),a.buffer.push("\n"),i})}),define("warm-it-up-ember/templates/users",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.Handlebars.template(function(e,t,n,r,a){function o(e,t){var s,r="";return t.buffer.push("\n  <h3>"),s=n._triageMustache.call(e,"name",{hash:{},hashTypes:{},hashContexts:{},contexts:[e],types:["ID"],data:t}),(s||0===s)&&t.buffer.push(s),t.buffer.push("</h3>\n"),r}this.compilerInfo=[4,">= 1.0.0"],n=this.merge(n,s.Handlebars.helpers),a=a||{};var i,u="",l=this;return a.buffer.push("<h1>Users</h1>\n"),i=n.each.call(t,{hash:{},hashTypes:{},hashContexts:{},inverse:l.noop,fn:l.program(1,o,a),contexts:[],types:[],data:a}),(i||0===i)&&a.buffer.push(i),u})}),define("warm-it-up-ember/views/posses/index",["ember","exports"],function(e,t){"use strict";var s=e["default"];t["default"]=s.View.extend({didInsertElement:function(){new Date,$(".clock").FlipClock({clockFace:"TwelveHourClock"})}})}),define("warm-it-up-ember/config/environment",["ember"],function(e){var t="warm-it-up-ember";try{var s=t+"/config/environment",n=e["default"].$('meta[name="'+s+'"]').attr("content"),r=JSON.parse(unescape(n));return{"default":r}}catch(a){throw new Error('Could not read config from meta tag with name "'+s+'".')}}),runningTests?require("warm-it-up-ember/tests/test-helper"):require("warm-it-up-ember/app")["default"].create({});