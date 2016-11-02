module.exports = {
	items :[
		{
			name: "Home",
			link: "/m/main/",
			icon: "fa-home",
			roles: "admin,emp"
		},
		{
			name: "Create Position",
			link: "/m/positions/#/createpos",
			icon: "fa-group",
			roles: "admin"
		}, 
        {
			name: "Feedback Templates",
			link: "/m/positions/#/feedbackTmpl/list",
			icon: "fa-group",
			roles: "admin"
		}, 
        {
			name: "Chat",
			link: "/m/positions/#/chat",
			icon: "fa-wechat",
			roles: "admin,emp"
		}, 
  		{
			name: "Open Positions",
			link: "/m/positions#/positions",
			icon: "fa-phone",
			roles: "admin,emp"
		},
        {
			name: "Charts",
			link: "/m/positions/#/chart",
			icon: "fa-bar-chart",
			roles: "admin,emp"
		},
		{
			name: "Logout",
			link: "/logout",
			icon: "fa-sign-out",
			roles: "admin,emp"
		}
	]
}
