(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{173:function(e,n){},190:function(e){e.exports={region:"ap-northeast-2",endpoint:"apigateway.ap-northeast-2.amazonaws.com","profile-chat":{endpoint:"https://profile-chat-api.anpaul0615.com"}}},23:function(e,n,t){"use strict";var a=t(51),r=t(319),o=t(136),i=t(32),s=t(33),c=t(90),u=t(89),l=function(){function e(n){Object(i.a)(this,e),this.globalConfig=n,this.userPool=new c.d({UserPoolId:u.UserPoolId,ClientId:u.ClientId})}return Object(s.a)(e,[{key:"getUserName",value:function(){var e=this;return new Promise(function(n,t){return e.cognitoUser?n(e.cognitoUser.username):t(new Error("Empty Session Data..!"))})}},{key:"getCredentials",value:function(){var e=this;return new Promise(function(n){return n(e.globalConfig.credentials)})}},{key:"updateCredentials",value:function(){var e=this;return new Promise(function(n,t){var r=e.cognitoUserSession.getIdToken().getJwtToken(),i="".concat(u.endpoint,"/").concat(u.UserPoolId),s=new a.CognitoIdentityCredentials({IdentityPoolId:u.IdentityPoolId,Logins:Object(o.a)({},i,r)});e.globalConfig.credentials=s,e.globalConfig.credentials.refresh(function(e){return e?t(e):n()})})}},{key:"setUserSessionFromStorage",value:function(){var e=this;return new Promise(function(n,t){e.cognitoUser=e.userPool.getCurrentUser(),e.cognitoUser.getSession(function(a,r){return a?t(a):(e.cognitoUserSession=r,n())})})}},{key:"setUserSessionByAuthentication",value:function(e,n){var t=this;return new Promise(function(a,r){t.cognitoUser=new c.b({Username:e,Pool:t.userPool});var o=new c.a({Username:e,Password:n});t.cognitoUser.authenticateUser(o,{onSuccess:function(e){t.cognitoUserSession=e,a(e)},onFailure:function(e){return r(e)}})})}},{key:"registerNewAccount",value:function(e,n){var t=this;return new Promise(function(a,r){var o=e.split("@")[0],i=[new c.c({Name:"email",Value:e}),new c.c({Name:"name",Value:o})];t.userPool.signUp(o,n,i,null,function(e,n){return e?r(e):a({userName:n.user.getUsername()})})})}},{key:"signout",value:function(){this.cognitoUser.signOut()}},{key:"clearStorage",value:function(){0!==this.userPool.storage.length&&this.userPool.storage.clear()}}]),e}(),d=t(320),h=t.n(d),p=t(88),f=function(){function e(n){Object(i.a)(this,e),this.globalConfig=n}return Object(s.a)(e,[{key:"init",value:function(e){var n=this;this.mqtt&&(this.mqtt.end(),delete this.mqtt),this.mqtt=h.a.device({region:p.region,host:p["profile-chat"].endpoint,clientId:e,protocol:"wss",maximumReconnectTimeMs:5e3,accessKeyId:this.globalConfig.credentials.accessKeyId,secretKey:this.globalConfig.credentials.secretAccessKey,sessionToken:this.globalConfig.credentials.sessionToken}),this.mqtt.on("connect",function(){}),this.mqtt.on("reconnect",function(){}),this.mqtt.on("offline",function(){}),this.mqtt.on("error",function(){}),this.mqtt.on("message",function(e,t){n.recieveMessageCallback(t.toString())})}},{key:"registerMessageCallback",value:function(e){this.recieveMessageCallback&&delete this.recieveMessageCallback,this.recieveMessageCallback=e}},{key:"publish",value:function(e,n){var t=this;return new Promise(function(a,r){t.mqtt.publish(e,n,null,function(e){e?r(e):a()})})}},{key:"subscribe",value:function(e){var n=this;return new Promise(function(t,a){n.mqtt.subscribe(e,null,function(e,n){e?a(e):t(n)})})}},{key:"unsubscribe",value:function(e){var n=this;return new Promise(function(t,a){n.mqtt.unsubscribe(e,function(e){e?a(e):t()})})}},{key:"disconnect",value:function(){this.mqtt.end()}}]),e}(),g=t(13),m=t.n(g),b=t(27),v=function(){function e(n){Object(i.a)(this,e),this.iotClient=new a.Iot,this.globalConfig=n}return Object(s.a)(e,[{key:"attachUserIdentityToPolicy",value:function(){var e=Object(b.a)(m.a.mark(function e(n,t){var a=this;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.iotClient.config.update({credentials:this.globalConfig.credentials,region:p.region,endpoint:p.endpoint}),e.abrupt("return",new Promise(function(e,r){a.iotClient.attachPrincipalPolicy({policyName:n,principal:t},function(n,t){return n?r(n):e(t)})}));case 2:case"end":return e.stop()}},e,this)}));return function(n,t){return e.apply(this,arguments)}}()}]),e}(),x=t(321);t.d(n,"a",function(){return w}),t.d(n,"b",function(){return k}),t.d(n,"c",function(){return y}),t.d(n,"d",function(){return S}),a.config.update({region:r.region});var w=new x.a(a.config),k=new l(a.config),y=new f(a.config),S=new v(a.config)},298:function(e,n,t){"use strict";(function(e){var a=t(13),r=t.n(a),o=t(27),i=t(32),s=t(33),c=t(48),u=t(47),l=t(49),d=t(10),h=t(0),p=t.n(h),f=t(11),g=t(302),m=t(23);function b(){var e=Object(d.a)(["\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: rgba(0,0,0,0.6);\n"]);return b=function(){return e},e}var v=f.a.div(b()),x=function(n){function t(n){var a;Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,n))).checkPreviousSessionData=Object(o.a)(r.a.mark(function e(){var n,t,o,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,m.b.setUserSessionFromStorage();case 3:return e.next=5,m.b.updateCredentials();case 5:return e.next=7,m.b.getCredentials();case 7:return n=e.sent,e.next=10,m.b.getUserName();case 10:return t=e.sent,e.next=13,a.setGlobalState({isPending:!0});case 13:return e.next=15,a.attachIotPolicy(n.identityId);case 15:return i=o=t,e.next=19,a.checkMessageGroup(i);case 19:if(e.sent){e.next=22;break}return e.next=22,a.createMessageGroup(i,o);case 22:return e.next=24,a.setGlobalState({isPending:!1,currentPage:"/",currentUser:o,currentGroup:i});case 24:e.next=28;break;case 26:e.prev=26,e.t0=e.catch(0);case 28:case"end":return e.stop()}},e,this,[[0,26]])})),a.attachIotPolicy=function(e){return m.d.attachUserIdentityToPolicy("iot-chat-policy",e)},a.checkMessageGroup=function(e){return m.a.invokeAPIGateway({path:"/messages/group",method:"GET",queryParams:{groupId:e}}).then(function(){return!0}).catch(function(){return!1})},a.createMessageGroup=function(e,n){return m.a.invokeAPIGateway({path:"/messages/group",method:"POST",body:{groupId:e,groupName:n,groupUsers:[n,"anpaul0615"]}})},a.handleInputEmail=function(e){var n=e.target.value;a.setState(function(){return{email:n}})},a.handleInputPassword=function(e){var n=e.target.value;a.setState(function(){return{password:n}})},a.handleSignin=Object(o.a)(r.a.mark(function n(){var t,o,i,s,c,u,l;return r.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,t=a.state,o=t.email,i=t.password,s=o.split("@")[0],m.b.clearStorage(),n.next=6,m.b.setUserSessionByAuthentication(s,i);case 6:return n.next=8,m.b.updateCredentials();case 8:return n.next=10,m.b.getCredentials();case 10:return c=n.sent,n.next=13,a.setGlobalState({isPending:!0});case 13:return n.next=15,a.attachIotPolicy(c.identityId);case 15:return l=u=s,n.next=19,a.checkMessageGroup(l);case 19:if(n.sent){n.next=22;break}return n.next=22,a.createMessageGroup(l,u);case 22:return n.next=24,a.setGlobalState({isPending:!1,currentPage:"/",currentUser:u,currentGroup:l});case 24:n.next=29;break;case 26:n.prev=26,n.t0=n.catch(0),e.window.alert(n.t0.message||n.t0);case 29:case"end":return n.stop()}},n,this,[[0,26]])})),a.handleMoveSignupPage=Object(o.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.setGlobalState({currentPage:"/signup"});case 2:case"end":return e.stop()}},e,this)}));var s=n.getGlobalState,l=n.setGlobalState;return a.getGlobalState=s,a.setGlobalState=l,a}return Object(l.a)(t,n),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.checkPreviousSessionData()}},{key:"render",value:function(){return p.a.createElement(v,null,p.a.createElement(g.a,{handleInputEmail:this.handleInputEmail,handleInputPassword:this.handleInputPassword,handleSignin:this.handleSignin,handleMoveSignupPage:this.handleMoveSignupPage}))}}]),t}(p.a.Component);n.a=x}).call(this,t(24))},302:function(e,n,t){"use strict";var a=t(10),r=t(0),o=t.n(r),i=t(11),s=(t(209),t(140)),c=t(334),u=t(68),l=t(335),d=t(945),h=t(333);function p(){var e=Object(a.a)(["\n  color: #4183c4;\n  text-decoration: none;\n  cursor: pointer;\n"]);return p=function(){return e},e}function f(){var e=Object(a.a)(["\n  max-width: 500px;\n  max-height: 440px;\n  margin: 0 auto;\n  position: relative;\n  top: 30%;\n  border-radius: 8px;\n  background-color: transparent;\n  background: rgba(255,255,255,1);\n"]);return f=function(){return e},e}var g=i.a.div(f()),m=i.a.span(p());n.a=function(e){var n=e.handleInputEmail,t=e.handleInputPassword,a=e.handleSignin,r=e.handleMoveSignupPage;return o.a.createElement(g,null,o.a.createElement(s.a,{textAlign:"center",style:{height:"100%"},verticalAlign:"middle"},o.a.createElement(s.a.Column,{style:{maxWidth:450}},o.a.createElement(c.a,{as:"h2",color:"grey",textAlign:"center"},"Log-in to your account"),o.a.createElement(u.a,{size:"large"},o.a.createElement(l.a,null,o.a.createElement(u.a.Input,{icon:"user",iconPosition:"left",fluid:!0,placeholder:"E-mail address",onChange:n}),o.a.createElement(u.a.Input,{icon:"lock",iconPosition:"left",fluid:!0,placeholder:"Password",type:"password",onChange:t}),o.a.createElement(d.a,{color:"blue",size:"large",fluid:!0,onClick:a},"Signin")),o.a.createElement(h.a,null,"New to here? \xa0",o.a.createElement(m,{onClick:r},"Sign Up"))))))}},319:function(e){e.exports={region:"ap-northeast-2"}},321:function(e,n,t){"use strict";(function(e){t.d(n,"a",function(){return l});var a=t(13),r=t.n(a),o=t(27),i=t(32),s=t(33),c=t(190),u=t(322),l=function(){function n(e){Object(i.a)(this,n),this.globalConfig=e}return Object(s.a)(n,[{key:"invokeAPIGateway",value:function(){var n=Object(o.a)(r.a.mark(function n(t){var a,o,i,s,l,d,h,p,f,g,m,b,v,x;return r.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(a=t.path,o=void 0===a?"/":a,i=t.method,s=void 0===i?"GET":i,l=t.headers,d=void 0===l?{}:l,h=t.queryParams,p=void 0===h?{}:h,f=t.body,this.globalConfig.credentials){n.next=3;break}throw new Error("User is not logged in..!");case 3:if(!(Date.now()>this.globalConfig.credentials.expireTime-6e4)){n.next=5;break}throw new Error("Expired-time is nearby..!");case 5:return g=u.a.newClient({accessKey:this.globalConfig.credentials.accessKeyId,secretKey:this.globalConfig.credentials.secretAccessKey,sessionToken:this.globalConfig.credentials.sessionToken,region:c.region,endpoint:c["profile-chat"].endpoint}),m=g.signRequest({method:s,path:o,headers:d,queryParams:p,body:f}),b=f?JSON.stringify(f):f,v=m.headers,n.next=11,e.fetch(m.url,{method:s,headers:v,body:b});case 11:if(200===(x=n.sent).status){n.next=18;break}return n.t0=Error,n.next=16,x.text();case 16:throw n.t1=n.sent,new n.t0(n.t1);case 18:return n.abrupt("return",x.json());case 19:case"end":return n.stop()}},n,this)}));return function(e){return n.apply(this,arguments)}}()}]),n}()}).call(this,t(24))},322:function(e,n,t){"use strict";var a=t(86),r=t(109),o=t.n(r),i=t(323),s=t.n(i),c=t(324),u=t.n(c),l=t(83),d=t.n(l),h={};h.util={URL:d.a},h.newClient=function(e){var n="AWS4-HMAC-SHA256",t="aws4_request",r="AWS4";function i(e){return o()(e)}function c(e){return e.toString(s.a)}function l(e,n){return u()(n,e,{asBytes:!0})}function d(e){if(Object.keys(e).length<1)return"";var n=[];Object.keys(e).forEach(function(e){n.push(e)}),n.sort();var t="";return n.forEach(function(n){t+="".concat(n,"=").concat(encodeURIComponent(e[n]),"&")}),t.substr(0,t.length-1)}function p(e){var n=[];return Object.keys(e).forEach(function(e){n.push(e.toLowerCase())}),n.sort(),n.join(";")}function f(e,n,t,a,r){return[e,(o=n,encodeURI(o)),d(t),function(e){var n=[];Object.keys(e).forEach(function(e){n.push(e)}),n.sort();var t="";return n.forEach(function(n){t+="".concat(n.toLowerCase(),":").concat(e[n],"\n")}),t}(a),p(a),c(i(r))].join("\n");var o}var g={};if(void 0===e.accessKey||void 0===e.secretKey)return g;g.accessKey=e.accessKey,g.secretKey=e.secretKey,g.sessionToken=e.sessionToken,g.serviceName=e.serviceName||"execute-api",g.region=e.region||"us-east-1",g.defaultAcceptType=e.defaultAcceptType||"application/json",g.defaultContentType=e.defaultContentType||"application/json";var m=e.endpoint,b=/(^https?:\/\/[^\/]+)/g.exec(m)[1],v=m.substring(b.length);return g.endpoint=b,g.pathComponent=v,g.signRequest=function(e){var o=e.method.toUpperCase(),s=g.pathComponent+e.path,u=Object(a.a)({},e.queryParams),m=Object(a.a)({},e.headers);void 0===m["Content-Type"]&&(m["Content-Type"]=g.defaultContentType),void 0===m.Accept&&(m.Accept=g.defaultAcceptType);var b=Object(a.a)({},e.body);""!==(b=void 0===e.body||"GET"===o?"":JSON.stringify(b))&&void 0!==b&&null!==b||delete m["Content-Type"];var v=(new Date).toISOString().replace(/\.\d{3}Z$/,"Z").replace(/[:-]|\.\d{3}/g,"");m["x-amz-date"]=v;var x=h.util.URL.parse(g.endpoint);m.host=x.hostname;var w=function(e){return c(i(e))}(f(o,s,u,m,b)),k=function(e,n,a){return"".concat(e.substr(0,8),"/").concat(n,"/").concat(a,"/").concat(t)}(v,g.region,g.serviceName),y=function(e,t,a){return"".concat(n,"\n").concat(e,"\n").concat(t,"\n").concat(a)}(v,k,w),S=function(e,n){return c(l(e,n))}(function(e,n,a,o){return l(l(l(l(r+e,n.substr(0,8)),a),o),t)}(g.secretKey,v,g.region,g.serviceName),y);m.Authorization=function(e,t,a,r){return"".concat(n," Credential=").concat(e,"/").concat(t,", SignedHeaders=").concat(p(a),", Signature=").concat(r)}(g.accessKey,k,m,S),void 0!==g.sessionToken&&""!==g.sessionToken&&(m["x-amz-security-token"]=g.sessionToken),delete m.host;var C=g.endpoint+s,G=d(u);return""!==G&&(C+="?".concat(G)),void 0===m["Content-Type"]&&(m["Content-Type"]=g.defaultContentType),{headers:m,url:C}},g},n.a=h},325:function(e,n,t){"use strict";(function(e){var a=t(13),r=t.n(a),o=t(27),i=t(32),s=t(33),c=t(48),u=t(47),l=t(49),d=t(10),h=t(0),p=t.n(h),f=t(11),g=t(326),m=t(23);function b(){var e=Object(d.a)(["\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: rgba(0,0,0,0.6);\n"]);return b=function(){return e},e}var v=f.a.div(b()),x=function(n){function t(n){var a;Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,n))).attachIotPolicy=function(e){return m.d.attachUserIdentityToPolicy("iot-chat-policy",e)},a.checkMessageGroup=function(e){return m.a.invokeAPIGateway({path:"/messages/group",method:"GET",queryParams:{groupId:e}}).then(function(){return!0}).catch(function(){return!1})},a.createMessageGroup=function(e,n){return m.a.invokeAPIGateway({path:"/messages/group",method:"POST",body:{groupId:e,groupName:n,groupUsers:[n,"anpaul0615"]}})},a.handleSignup=Object(o.a)(r.a.mark(function n(){var t,o,i,s;return r.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(n.prev=0,t=a.state,o=t.email,i=t.password,s=t.passwordConfirm,/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(o)){n.next=6;break}e.window.alert("Email Format is Invalid..!"),n.next=15;break;case 6:if(i===s){n.next=10;break}e.window.alert("Password Confirm is not matched..!"),n.next=15;break;case 10:return n.next=12,m.b.registerNewAccount(o,i);case 12:return e.window.alert("Confirmation code was sent to your email!!"),n.next=15,a.setGlobalState({currentPage:"/signin"});case 15:n.next=20;break;case 17:n.prev=17,n.t0=n.catch(0),e.window.alert(n.t0.message||n.t0);case 20:case"end":return n.stop()}},n,this,[[0,17]])})),a.handleInputEmail=function(e){var n=e.target.value;a.setState(function(){return{email:n}})},a.handleInputPassword=function(e){var n=e.target.value;a.setState(function(){return{password:n}})},a.handleInputPasswordConfirm=function(e){var n=e.target.value;a.setState(function(){return{passwordConfirm:n}})},a.handleMoveSigninPage=Object(o.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.setGlobalState({currentPage:"/signin"});case 2:case"end":return e.stop()}},e,this)}));var s=n.getGlobalState,l=n.setGlobalState;return a.getGlobalState=s,a.setGlobalState=l,a}return Object(l.a)(t,n),Object(s.a)(t,[{key:"render",value:function(){return p.a.createElement(v,null,p.a.createElement(g.a,{handleInputEmail:this.handleInputEmail,handleInputPassword:this.handleInputPassword,handleInputPasswordConfirm:this.handleInputPasswordConfirm,handleSignup:this.handleSignup,handleMoveSigninPage:this.handleMoveSigninPage}))}}]),t}(p.a.Component);n.a=x}).call(this,t(24))},326:function(e,n,t){"use strict";var a=t(10),r=t(0),o=t.n(r),i=t(11),s=(t(209),t(140)),c=t(334),u=t(68),l=t(335),d=t(945),h=t(333);function p(){var e=Object(a.a)(["\n  color: #4183c4;\n  text-decoration: none;\n  cursor: pointer;\n"]);return p=function(){return e},e}function f(){var e=Object(a.a)(["\n  max-width: 500px;\n  max-height: 440px;\n  margin: 0 auto;\n  position: relative;\n  top: 30%;\n  border-radius: 8px;\n  background-color: transparent;\n  background: rgba(255,255,255,1);\n"]);return f=function(){return e},e}var g=i.a.div(f()),m=i.a.span(p());n.a=function(e){var n=e.handleInputEmail,t=e.handleInputPassword,a=e.handleInputPasswordConfirm,r=e.handleSignup,i=e.handleMoveSigninPage;return o.a.createElement(g,null,o.a.createElement(s.a,{textAlign:"center",style:{height:"100%"},verticalAlign:"middle"},o.a.createElement(s.a.Column,{style:{maxWidth:450}},o.a.createElement(c.a,{as:"h2",color:"grey",textAlign:"center"},"Create new account"),o.a.createElement(u.a,{size:"large"},o.a.createElement(l.a,null,o.a.createElement(u.a.Input,{icon:"user",iconPosition:"left",fluid:!0,placeholder:"E-mail address",onChange:n}),o.a.createElement(u.a.Input,{icon:"lock",iconPosition:"left",fluid:!0,placeholder:"Password",type:"password",onChange:t}),o.a.createElement(u.a.Input,{icon:"lock",iconPosition:"left",fluid:!0,placeholder:"Password Confirm",type:"password",onChange:a}),o.a.createElement(d.a,{color:"blue",size:"large",fluid:!0,onClick:r},"Signup")),o.a.createElement(h.a,null,"Already be registered? \xa0",o.a.createElement(m,{onClick:i},"Sign In"))))))}},327:function(e,n,t){"use strict";(function(e){var a=t(139),r=t(13),o=t.n(r),i=t(27),s=t(32),c=t(33),u=t(48),l=t(47),d=t(49),h=t(10),p=t(0),f=t.n(p),g=t(11),m=t(330),b=t(329),v=t(23);function x(){var e=Object(h.a)(["\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n"]);return x=function(){return e},e}var w=g.a.div(x()),k=function(n){function t(n){var r;Object(s.a)(this,t),(r=Object(u.a)(this,Object(l.a)(t).call(this,n))).initMessages=Object(i.a)(o.a.mark(function e(){var n,t,a,i,s;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,r.setGlobalState({isPending:!0});case 3:return e.next=5,r.getGlobalState();case 5:return n=e.sent,t=n.currentGroup,a=n.currentUser,e.next=10,v.a.invokeAPIGateway({path:"/messages",method:"GET",queryParams:{groupId:t,startDate:"1000-01-01T00:00:00.000Z",endtDate:(new Date).toISOString(),limit:50}}).then(function(e){return e.data}).catch(function(){return[]});case 10:return i=e.sent,s=i.map(function(e){return{isMine:e.userName===a,userName:e.userName,content:e.content,regDate:e.regDate}}).reverse(),r.setState(function(){return{messages:s}}),r.moveMessageHistoryScollToBottom(),e.next=16,r.setGlobalState({isPending:!1});case 16:e.next=20;break;case 18:e.prev=18,e.t0=e.catch(0);case 20:case"end":return e.stop()}},e,this,[[0,18]])})),r.initMessageSubscribe=Object(i.a)(o.a.mark(function e(){var n,t,a,i;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v.b.getCredentials();case 3:return n=e.sent,e.next=6,r.getGlobalState();case 6:return t=e.sent,a=t.currentGroup,i=t.currentUser,v.c.init(n,i),e.next=12,v.c.subscribe(a);case 12:v.c.registerMessageCallback(r.handleRecievedMessage),e.next=17;break;case 15:e.prev=15,e.t0=e.catch(0);case 17:case"end":return e.stop()}},e,this,[[0,15]])})),r.initMessageHistoryScoll=function(e){r.messageHistoryScrollDiv=e},r.moveMessageHistoryScollToBottom=function(){r.messageHistoryScrollDiv&&r.messageHistoryScrollDiv.scrollIntoView(!1)},r.handleSignout=Object(i.a)(o.a.mark(function n(){return o.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(!e.window.confirm("Signout Now?")){n.next=12;break}return n.prev=1,v.b.signout(),v.b.clearStorage(),v.c.disconnect(),n.next=7,r.setGlobalState({currentPage:"/signin",currentUser:"",currentGroup:""});case 7:e.window.parent.postMessage("chat-off","*"),n.next=12;break;case 10:n.prev=10,n.t0=n.catch(1);case 12:case"end":return n.stop()}},n,this,[[1,10]])})),r.handleRecievedMessage=function(){var e=Object(i.a)(o.a.mark(function e(n){var t,i,s;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=JSON.parse(n),e.next=3,r.getGlobalState();case 3:i=e.sent,s=i.currentUser,t.isMine=t.userName===s,r.setState(function(e){return{messages:Object(a.a)(e.messages).concat([t])}}),r.moveMessageHistoryScollToBottom();case 8:case"end":return e.stop()}},e,this)}));return function(n){return e.apply(this,arguments)}}(),r.handleInputMessage=function(e){var n=e.target.value;r.setState(function(){return{messageBuffer:n}})},r.handleSendMessage=Object(i.a)(o.a.mark(function e(){var n,t,a,i,s;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,""!==(n=r.state.messageBuffer)){e.next=4;break}return e.abrupt("return");case 4:return r.setGlobalState({isPending:!0}),e.next=7,r.getGlobalState();case 7:return t=e.sent,a=t.currentGroup,i=t.currentUser,s={groupId:a,regDate:(new Date).toISOString(),content:n,userName:i},e.next=13,v.a.invokeAPIGateway({path:"/messages",method:"POST",body:s});case 13:return e.next=15,v.c.publish(a,JSON.stringify(s));case 15:r.setState(function(){return{messageBuffer:""}}),r.setGlobalState({isPending:!1}),r.moveMessageHistoryScollToBottom(),e.next=22;break;case 20:e.prev=20,e.t0=e.catch(0);case 22:case"end":return e.stop()}},e,this,[[0,20]])})),r.handleSendMessageShortcut=function(e){13===e.keyCode&&e.ctrlKey&&r.handleSendMessage()},r.handleMoveSignupPage=Object(i.a)(o.a.mark(function e(){return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.setGlobalState({currentPage:"/group"});case 2:case"end":return e.stop()}},e,this)})),r.handleGetOlderMessages=Object(i.a)(o.a.mark(function e(){var n,t,i,s,c,u,l,d;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(0===(n=r.state.messages).length){e.next=23;break}return e.prev=2,e.next=5,r.setGlobalState({isPending:!0});case 5:return t=n[0],i=new Date(t.regDate).getTime()-1,e.next=9,r.getGlobalState();case 9:return s=e.sent,c=s.currentGroup,u=s.currentUser,e.next=14,v.a.invokeAPIGateway({path:"/messages",method:"GET",queryParams:{groupId:c,startDate:"1000-01-01T00:00:00.000Z",endDate:new Date(i).toISOString(),limit:50}}).then(function(e){return e.data}).catch(function(){return[]});case 14:return l=e.sent,d=(l||[]).map(function(e){return{isMine:e.userName===u,userName:e.userName,content:e.content,regDate:e.regDate}}).reverse(),r.setState(function(e){return{messages:Object(a.a)(d).concat(Object(a.a)(e.messages))}}),e.next=19,r.setGlobalState({isPending:!1});case 19:e.next=23;break;case 21:e.prev=21,e.t0=e.catch(2);case 23:case"end":return e.stop()}},e,this,[[2,21]])}));var c=n.getGlobalState,d=n.setGlobalState;return r.getGlobalState=c,r.setGlobalState=d,r.state={messageBuffer:"",messages:[]},r}return Object(d.a)(t,n),Object(c.a)(t,[{key:"componentDidMount",value:function(){e.window.document.addEventListener("keydown",this.handleSendMessageShortcut),this.initMessages(),this.initMessageSubscribe()}},{key:"componentWillUnmount",value:function(){e.window.document.removeEventListener("keydown",this.handleSendMessageShortcut)}},{key:"render",value:function(){var e=this.state,n=e.messageBuffer,t=e.messages;return f.a.createElement(w,null,f.a.createElement(m.a,{handleClickAppExitButton:this.handleSignout,handleClickOpenChatGroupButton:this.handleMoveSignupPage}),f.a.createElement(b.a,{messages:t,messageBuffer:n,initMessageHistoryScoll:this.initMessageHistoryScoll,handleGetOlderMessages:this.handleGetOlderMessages,handleInputMessage:this.handleInputMessage,handleSendMessage:this.handleSendMessage}))}}]),t}(f.a.Component);n.a=k}).call(this,t(24))},328:function(e,n,t){"use strict";(function(e){var a=t(13),r=t.n(a),o=t(27),i=t(32),s=t(33),c=t(48),u=t(47),l=t(49),d=t(10),h=t(0),p=t.n(h),f=t(11),g=t(332),m=t(331),b=t(23);function v(){var e=Object(d.a)(["\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n"]);return v=function(){return e},e}var x=f.a.div(v()),w=function(n){function t(n){var a;Object(i.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,n))).initChatGroups=Object(o.a)(r.a.mark(function e(){var n,t,o,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,a.getGlobalState();case 3:return n=e.sent,t=n.currentUser,e.next=7,b.a.invokeAPIGateway({path:"/messages/group/search",method:"GET",queryParams:{userName:t}});case 7:o=e.sent,i=o.data,a.setState(function(){return{chatGroups:i}}),e.next=14;break;case 12:e.prev=12,e.t0=e.catch(0);case 14:case"end":return e.stop()}},e,this,[[0,12]])})),a.handleCloseChatGroupPage=Object(o.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.setGlobalState({currentPage:"/"});case 2:case"end":return e.stop()}},e,this)})),a.handleChangeCurrentChatGroup=function(){var n=Object(o.a)(r.a.mark(function n(t){var o,i;return r.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,a.setGlobalState({isPending:!0});case 3:return n.next=5,a.getGlobalState();case 5:return o=n.sent,i=o.currentGroup,n.next=9,b.c.unsubscribe(i);case 9:return n.next=11,b.c.subscribe(t);case 11:return n.next=13,a.setGlobalState({isPending:!1,currentGroup:t});case 13:return n.next=15,a.handleCloseChatGroupPage();case 15:n.next=20;break;case 17:n.prev=17,n.t0=n.catch(0),e.window.alert(n.t0.message||n.t0);case 20:case"end":return n.stop()}},n,this,[[0,17]])}));return function(e){return n.apply(this,arguments)}}();var s=n.getGlobalState,l=n.setGlobalState;return a.getGlobalState=s,a.setGlobalState=l,a.state={chatGroups:[]},a}return Object(l.a)(t,n),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.initChatGroups()}},{key:"render",value:function(){var e=this.state.chatGroups;return p.a.createElement(x,null,p.a.createElement(g.a,{handleClickCloseChatGroupButton:this.handleCloseChatGroupPage}),p.a.createElement(m.a,{chatGroups:e,handleClickChatGroup:this.handleChangeCurrentChatGroup}))}}]),t}(p.a.Component);n.a=w}).call(this,t(24))},329:function(e,n,t){"use strict";var a=t(10),r=t(0),o=t.n(r),i=t(11);function s(){var e=Object(a.a)(["\n  display: inline-block;\n  padding: 10px 12px;\n  margin-bottom: 3px;\n  max-width: 230px;\n  border-radius: 15px;\n  border-top-left-radius: ",";\n  border-top-right-radius: ",";\n  text-align: ",";\n  font-size: 14px;\n  white-space: pre-line;\n  word-break: break-word;\n  word-wrap: break-word;\n  background-color: #EEF1F4;\n  color: #516378;\n"]);return s=function(){return e},e}function c(){var e=Object(a.a)(["\n  padding-left: ",";\n  padding-right: ",";\n  text-align: ",";\n"]);return c=function(){return e},e}var u=i.a.div(c(),function(e){return e.isMine?null:"10px"},function(e){return e.isMine?"10px":null},function(e){return e.isMine?"right":"left"}),l=i.a.div(s(),function(e){return e.isMine?null:"3px"},function(e){return e.isMine?"3px":null},function(e){return e.isMine?"right":"left"}),d=function(e){var n=e.isMine,t=e.content;return o.a.createElement(u,{isMine:n},o.a.createElement(l,{isMine:n},o.a.createElement("span",null,t)))};function h(){var e=Object(a.a)(["\n  color: rgb(169,169,169);\n  cursor: pointer;\n"]);return h=function(){return e},e}function p(){var e=Object(a.a)(["\n  width: 100%;\n  height: 20px;\n"]);return p=function(){return e},e}var f=i.a.div(p()),g=i.a.span(h()),m=function(e){var n=e.handleGetOlderMessages;return o.a.createElement(f,null,o.a.createElement(g,{onClick:function(){return n()}},"more"))};function b(){var e=Object(a.a)(["\n  height: auto;\n"]);return b=function(){return e},e}function v(){var e=Object(a.a)(["\n  width: 100%;\n  height: calc(100% - 80px);\n  padding: 12px 0px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n  background-color: #FFFFFF;\n  box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n"]);return v=function(){return e},e}var x=i.a.div(v()),w=i.a.div(b()),k=function(e){var n=e.messages,t=e.handleGetOlderMessages,a=e.initMessageHistoryScoll;return o.a.createElement(x,null,o.a.createElement(w,{innerRef:function(e){return a(e)}},o.a.createElement(m,{handleGetOlderMessages:t}),n?n.map(function(e,n){return o.a.createElement(d,{key:"msg-".concat(n),isMine:e.isMine,userName:e.userName,content:e.content,regDate:e.regDate})}):"no-data"))};function y(){var e=Object(a.a)(["\n  height: 19px;\n  flex-grow: 1;\n  flex-shrink: 1;\n  flex-basis: 0;\n  font-size: 14px;\n  border: none;\n  resize: none;\n  margin: auto;\n  padding: 18px 10px 18px;\n  white-space: pre-wrap;\n  overflow-x: hidden;\n  overflow-y: auto;\n"]);return y=function(){return e},e}var S=i.a.textarea(y()),C=function(e){var n=e.messageBuffer,t=e.handleChangeInputText;return o.a.createElement(S,{value:n,onChange:t,placeholder:"Please Input Here."})};function G(){var e=Object(a.a)(["\n  width: 46px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n\n  &:before {\n    content: '';\n    display: block;\n    width: 24px;\n    height: 24px;\n    background-image: url(./img/send-button.png);\n    background-size: cover;\n    opacity: 0.6;\n  }\n"]);return G=function(){return e},e}var P=i.a.div(G()),E=function(e){var n=e.handleClickMessageSendButton;return o.a.createElement(P,{onClick:function(){return n()}})};function O(){var e=Object(a.a)(["\n  width: 100%;\n  height: 56px;\n  position: relative;\n  display: flex;\n  align-items: center;\n  border-top: 1px solid rgba(81,99,120,0.2);\n  box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n"]);return O=function(){return e},e}var j=i.a.div(O()),I=function(e){var n=e.messageBuffer,t=e.handleChangeInputText,a=e.handleClickMessageSendButton;return o.a.createElement(j,null,o.a.createElement(C,{messageBuffer:n,handleChangeInputText:t}),o.a.createElement(E,{handleClickMessageSendButton:a}))};function M(){var e=Object(a.a)(["\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: hidden;\n"]);return M=function(){return e},e}var T=i.a.div(M());n.a=function(e){var n=e.messages,t=e.messageBuffer,a=e.handleInputMessage,r=e.handleSendMessage,i=e.handleGetOlderMessages,s=e.initMessageHistoryScoll;return o.a.createElement(T,null,o.a.createElement(k,{messages:n,initMessageHistoryScoll:s,handleGetOlderMessages:i}),o.a.createElement(I,{messageBuffer:t,handleChangeInputText:a,handleClickMessageSendButton:r}))}},330:function(e,n,t){"use strict";var a=t(10),r=t(0),o=t.n(r),i=t(11);function s(){var e=Object(a.a)(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 56px;\n  height: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  \n  &:before {\n    content: '';\n    display: block;\n    width: 24px;\n    height: 24px;\n    background-image: url(./img/config-button.png);\n    background-size: cover;\n    opacity: 0.6;\n  }\n"]);return s=function(){return e},e}var c=i.a.div(s()),u=function(e){var n=e.handleClickOpenChatGroupButton;return o.a.createElement(c,{onClick:function(){return n()}})};function l(){var e=Object(a.a)(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 56px;\n  height: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  \n  &:before {\n    content: '';\n    display: block;\n    width: 24px;\n    height: 24px;\n    background-image: url(./img/close-button.png);\n    background-size: cover;\n    opacity: 0.6;\n  }\n"]);return l=function(){return e},e}var d=i.a.div(l()),h=function(e){var n=e.handleClickAppExitButton;return o.a.createElement(d,{onClick:function(){return n()}})};function p(){var e=Object(a.a)(["\n  position: relative;\n  height: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-top-left-radius: 12px;\n  border-top-right-radius: 12px;\n  font-size: 14px;\n  font-weight: 600;\n  color: white;\n  background-color: #4e66ff;\n  box-shadow: 0 1px 2px 0 rgba(47,55,64,0.2);\n  overflow: hidden;\n  z-index: 2;\n  align-items: center;\n"]);return p=function(){return e},e}var f=i.a.div(p());n.a=function(e){var n=e.handleClickOpenChatGroupButton,t=e.handleClickAppExitButton;return o.a.createElement(f,null,o.a.createElement(u,{handleClickOpenChatGroupButton:n}),"ChatHeader",o.a.createElement(h,{handleClickAppExitButton:t}))}},331:function(e,n,t){"use strict";var a=t(10),r=t(0),o=t.n(r),i=t(11);function s(){var e=Object(a.a)(["\n  width: 100%;\n  height: calc(100% - 30px);\n  padding: 0px 8px;\n  font-size: 12px;\n  text-align: left;\n  border: none;\n"]);return s=function(){return e},e}function c(){var e=Object(a.a)(["\n  width: 100%;\n  height: 30px;\n  padding: 4px 8px;\n  font-size: 20px;\n  font-weight: 600;\n  text-align: left;\n  border: none;\n"]);return c=function(){return e},e}function u(){var e=Object(a.a)(["\n  width: 100%;\n  height: 80px;\n  padding: 5px;\n  overflow: hidden;\n  background-color: #FFFFFF;\n  border-bottom: 1px solid #E8EBED;\n"]);return u=function(){return e},e}var l=i.a.div(u()),d=i.a.div(c()),h=i.a.div(s()),p=function(e){var n=e.groupName,t=e.lastMessage,a=e.handleClickChatGroup;return o.a.createElement(l,{onClick:function(){return a(n)}},o.a.createElement(d,null,n),o.a.createElement(h,null,t.content))};p.defaultProps={lastMessage:{content:"-"}};var f=p;function g(){var e=Object(a.a)(["\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: hidden;\n  background-color: #FFFFFF;\n"]);return g=function(){return e},e}var m=i.a.div(g()),b=function(e){var n=e.chatGroups,t=e.handleClickChatGroup;return o.a.createElement(m,null,n.map(function(e){return o.a.createElement(f,{key:e.groupName,groupName:e.groupName,groupNickName:e.groupnickname,lastMessage:e.lastMessage,handleClickChatGroup:t})}))};function v(){var e=Object(a.a)(["\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: hidden;\n  background-color: #FFFFFF;\n"]);return v=function(){return e},e}var x=i.a.div(v());n.a=function(e){var n=e.chatGroups,t=e.handleClickChatGroup;return o.a.createElement(x,null,o.a.createElement(b,{chatGroups:n,handleClickChatGroup:t}))}},332:function(e,n,t){"use strict";var a=t(10),r=t(0),o=t.n(r),i=t(11);function s(){var e=Object(a.a)(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  opacity: 0.6;\n  font-weight: 600;\n  padding: 0 16px;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  max-width: 90px;\n"]);return s=function(){return e},e}var c=i.a.div(s()),u=function(e){var n=e.handleClickCloseChatGroupButton;return o.a.createElement(c,{onClick:function(){return n()}},"\ub2eb\uae30")};function l(){var e=Object(a.a)(["\n  position: relative;\n  height: 60px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-top-left-radius: 12px;\n  border-top-right-radius: 12px;\n  font-size: 14px;\n  font-weight: 600;\n  color: white;\n  background-color: #4e66ff;\n  box-shadow: 0 1px 2px 0 rgba(47,55,64,0.2);\n  overflow: hidden;\n  z-index: 2;\n  align-items: center;\n"]);return l=function(){return e},e}var d=i.a.div(l());n.a=function(e){var n=e.handleClickCloseChatGroupButton;return o.a.createElement(d,null,o.a.createElement(u,{handleClickCloseChatGroupButton:function(){return n()}}),"ChatGroupHeader")}},347:function(e,n,t){e.exports=t(937)},384:function(e,n,t){},386:function(e,n,t){},868:function(e,n){},870:function(e,n){},879:function(e,n){},88:function(e){e.exports={region:"ap-northeast-2",endpoint:"iot.ap-northeast-2.amazonaws.com","profile-chat":{endpoint:"aodom5ybr70o3-ats.iot.ap-northeast-2.amazonaws.com"}}},881:function(e,n){},888:function(e,n){},889:function(e,n){},89:function(e){e.exports={region:"ap-northeast-2",endpoint:"cognito-idp.ap-northeast-2.amazonaws.com",IdentityPoolId:"ap-northeast-2:51823c02-5f74-4f03-9550-7a754236e84b",UserPoolId:"ap-northeast-2_0sCAcMhaV",ClientId:"1rok05motv90p32ao13f5tl2na"}},891:function(e,n){},893:function(e,n){},897:function(e,n){},899:function(e,n){},937:function(e,n,t){"use strict";t.r(n);t(348);var a=t(0),r=t.n(a),o=t(85),i=t.n(o),s=(t(384),t(86)),c=t(32),u=t(33),l=t(48),d=t(47),h=t(49),p=(t(386),t(298)),f=t(325),g=t(327),m=t(328),b=t(10),v=t(11),x=t(944);function w(){var e=Object(b.a)(["\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    background: rgba(0,0,0,0.6);\n    z-index: 255;\n"]);return w=function(){return e},e}var k=v.a.div(w()),y=function(){return r.a.createElement(k,null,r.a.createElement(x.a,{active:!0}))},S=function(e){function n(){var e;return Object(c.a)(this,n),(e=Object(l.a)(this,Object(d.a)(n).call(this))).getGlobalState=function(){return new Promise(function(n){return n(e.state)})},e.setGlobalState=function(n){return new Promise(function(t){return e.setState(function(){return t(),Object(s.a)({},n)})})},e.state={isPending:!1,currentUser:void 0,currentPage:"/signin"},e}return Object(h.a)(n,e),Object(u.a)(n,[{key:"render",value:function(){var e=this,n=this.state,t=n.isPending,a=n.currentPage;return r.a.createElement("div",{className:"App"},t&&r.a.createElement(y,null),function(){switch(a){case"/signin":return r.a.createElement(p.a,{key:"ChatSignin",setGlobalState:e.setGlobalState,getGlobalState:e.getGlobalState});case"/signup":return r.a.createElement(f.a,{key:"ChatSignup",setGlobalState:e.setGlobalState,getGlobalState:e.getGlobalState});case"/group":return r.a.createElement(m.a,{key:"ChatGroup",setGlobalState:e.setGlobalState,getGlobalState:e.getGlobalState});case"/":return r.a.createElement(g.a,{key:"Chat",setGlobalState:e.setGlobalState,getGlobalState:e.getGlobalState});default:return r.a.createElement("h1",null,"Something is wrong..!")}}())}}]),n}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[347,2,1]]]);
//# sourceMappingURL=main.5b36196b.chunk.js.map