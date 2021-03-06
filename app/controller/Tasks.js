/*
 * File: app/controller/Tasks.js
 *
 * This file was generated by Sencha Architect version 3.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('monitor.controller.Tasks', {
    extend: 'Ext.app.Controller',

    dataPings: [
        
    ],
    idService: 0,
    indexPing: 0,
    stores: [
        'Tasks',
        'Priorities',
        'PingStore'
    ],

    refs: [
        {
            ref: 'detailsPanel',
            selector: '#detailsPanel'
        },
        {
            ref: 'detailsToolbar',
            selector: '#detailsPanel #detailsToolbar'
        }
    ],

    view: function(target, record) {
        var me = this;
        console.log('Editing');
        var details = this.getDetailsPanel(),	// Get detail panel via controller ref
            toolbar = this.getDetailsToolbar();	// Get detail panel toolbar via controller ref


        var dataService = {
            id: record.data.id,
            url: record.data.url,
            method: record.data.method
        };
        this.dataPings = [{pings : []}];
        this.idService = record.data.id;
        this.indexPing = 0;

        Ext.Ajax.request({
            url: 'http://10.50.24.132:3000/request',
            params: dataService,
            method: 'post',
            //timeout: 5000,
            success: function(response) {
        //         console.log('response');

                test = response;
                if(response.responseText){
                    response.responseText = JSON.parse(response.responseText);
                    if(response.responseText.response)
                        response.responseText.response = JSON.parse(response.responseText.response);
                }


                var formatedJson = me.syntaxHighlight(response.responseText);

                details.update({'response':formatedJson});
                //details.labelJson.update(formatedJson);

            },
            failure: function(response){

        //         console.log(response.responseText);
                var formatedJson = me.syntaxHighlight(response.responseText);
                details.update({response:formatedJson});
            }
        });

        var me = this;
        var pingStore = me.getPingStoreStore();
        pingStore.removeAll();

        var chart = Ext.getCmp('chartStatus');
        chart.doAutoRender();

        // this.tunningServiceStore(store,url, true, objparams);
        // var proxy =  {
        //                 type: 'ajax',
        //                 url : 'http://10.50.24.160:3000/pings',
        //                 reader: {
        //                     type: 'json'
        //                 }
        //             };

        //mon instead on
        // pingStore.on('beforeload', function(store, operation) {
        // //     store.setProxy(proxy);
        //     store.getProxy().setExtraParam("id",record.data.id);
        // //    console.log('+1');

        // });
        if(this.idService)
        this.loadPings(this.idService,0,'Y');





        // Show toolbar
        //toolbar.show();

    },

    add: function(target) {

        var formWindow = Ext.create('widget.taskform'),	// Create new form window
        	form = formWindow.down('form').getForm(),	// Get form within window
            model = Ext.create('model.task');		// Create new Task model

        // Associate model with form
        form.loadRecord(model);

        // Show window
        formWindow.show();

    },

    edit: function(target) {

        var data = target.up('panel').data,						// Get panel's assosiated data
        	store = this.getTasksStore(),						// Get Tasks store
        	task = store.getById(data.id),						// Get current task
            formWindow = Ext.create('widget.taskform'),			// Create new form window
        	form = formWindow.down('form').getForm();			// Get form within window

        // Load task model into form
        form.loadRecord(task);

        // Show window
        formWindow.show();

    },

    save: function(target) {

        var form = target.up('form').getForm(),			// Get parent form
        	formWindow = target.up('window'),			// Get parent window
        	detailsPanel = this.getDetailsPanel(),		// Get details panel
        	detailsToolbar = this.getDetailsToolbar(),	// Get detail panel toolbar
        	task = form.getRecord(),					// Get task associated with form
        	store = this.getTasksStore(),				// Get Records store
        	isNew = !task.get('id');					// Is new if no task ID exists


        // Update associated task with form values
        var errors = form.updateRecord();

        // Valid
        if (form.isValid()) {

            // Add to store if new task
            if (isNew) {

                // Assign the task ID
                // Normally, this would be a generated ID
                var id = store.getTotalCount() + 1;
                task.set("id", id);

                // Add to store
                store.add(task);

            }

            // Commit changes
            store.commitChanges();

            // Update detail panel
            detailsPanel.update(task.getData());

            // Close window
            formWindow.destroy();

        }


        // Invalid
        else {

            // Show errors on form
            form.markInvalid(errors);

        }

    },

    cancelEdit: function(target) {

        // Get the window and close it
        var formWindow = target.up("window");
        	formWindow.destroy();

    },

    remove: function(target) {

        var me = this;

        // Confirm this delete
        Ext.Msg.confirm('Confirm', 'Are you sure you want to delete this task?', function(btn) {

            // User confirmed yes
            if (btn == 'yes') {

                var data = target.up('panel').data,				// Get assosiated data
                    store = me.getTasksStore(),					// Get tasks store
                    task = store.getById(data.id),				// Get current task
                    detailsPanel = me.getDetailsPanel(),		// Get details panel
                    detailsToolbar = me.getDetailsToolbar();	// Get details panel toolbar

                // Delete from store
                store.remove(task);

                // Clear panel content
                detailsPanel.update(null);

                // Hide toolbar
                detailsToolbar.hide();

            }


        });

    },

    onCboGroupSelect: function(combo, records, eOpts) {
        var taskStore = this.getTasksStore();
        this.filterByGroupName(taskStore);
    },

    onCboGroupChange: function(field, newValue, oldValue, eOpts) {
        var taskStore = this.getTasksStore();
        var combo = Ext.ComponentQuery.query('#cboGroup')[0];
        if(combo.value !== null && combo.value.length === 0){
            taskStore.clearFilter();
            combo.setValue('Filter by Group');
        }
    },

    init: function(application) {
                var me = this;

                var taskStore = me.getTasksStore();
                var task = taskStore.data.items;

                Ext.Date.fuzzy = function(time, local){

                    local = (!local) && (local = Date.now());

                    if (typeof time !== 'number' || typeof local !== 'number') {
                        return;
                    }

                    var
                    offset = Math.abs((local - time)/1000),
                    span   = [],
                    MINUTE = 60,
                    HOUR   = 3600,
                    DAY    = 86400,
                    WEEK   = 604800,
                    MONTH  = 2629744,
                    YEAR   = 31556926;
                    DECADE = 315569260;

                    if (offset <= MINUTE)              span = [ '', 'moments' ];
                    else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];
                    else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'hr' ];
                    else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'day' ];
                    else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
                    else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];
                    else if (offset < (DECADE * 100))  span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];
                    else                               span = [ '', 'a long time' ];

                    span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
                    span = span.join(' ');

                    return (time <= local)  ? span + ' ago' : 'in ' + span;
                };

                var registerService = 0;
                test = task;

                me.dataPings = [{pings : []}];
                setInterval(function() {

                    Ext.Ajax.request({
                        url: 'http://10.50.24.132:3000/elements',
                        method: 'get',
                        success: function(response) {

                            var resp = JSON.parse(response.responseText);
                            taskStore.loadRawData(resp);

                            resp.forEach(function(value,index){
                                var record = taskStore.findRecord('id',value.id);
                                if(value.last_status===0){
                                    record.set('icon','success.png');
                                    record.set('state', Ext.Date.fuzzy(new Date(value.last_status_change).getTime()));
                                }else{
                                    record.set('icon','fail.png');
                                    record.set('state', Ext.Date.fuzzy(new Date(value.last_status_change).getTime()));
                                }
                                record.set('response',me.syntaxHighlight(resp.response));
                                record.set('result',resp.result);
                            });

                            me.filterByGroupName(taskStore);
                        },
                        failure: function(response){
                            record.set('state','fail');
                            record.set('icon','fail.png');
                            record.set('response', '');
                            record.set('result','timeOut');
                        }
                    });
                    if(me.idService)
                    me.loadPings(me.idService,1);

                }, 20000);

                Ext.Ajax.request({
                    url: 'http://10.50.24.132:3000/elements',
                    method: 'get',
                    success: function(response) {

                        var resp = JSON.parse(response.responseText);
                        taskStore.loadRawData(resp);

                        resp.forEach(function(value,index){
                            var record = taskStore.findRecord('id',value.id);
                            if(value.last_status===0){
                                record.set('icon','success.png');
                                record.set('state', Ext.Date.fuzzy(new Date(value.last_status_change).getTime()));
                            }else{
                                record.set('icon','fail.png');
                                record.set('state', Ext.Date.fuzzy(new Date(value.last_status_change).getTime()));
                            }
                            record.set('response',me.syntaxHighlight(resp.response));
                            record.set('result',resp.result);
                        });

                        me.filterByGroupName(taskStore);
                    },
                    failure: function(response){
                        record.set('state','fail');
                        record.set('icon','fail.png');
                        record.set('response', '');
                        record.set('result','timeOut');
                    }
                });

        this.control({
            "#gridPanel": {
                select: this.view
            },
            "#mainPanel #addButton": {
                click: this.add
            },
            "#detailsPanel #editButton": {
                click: this.edit
            },
            "#recordForm #saveButton": {
                click: this.save
            },
            "#recordForm #cancelButton": {
                click: this.cancelEdit
            },
            "#detailsPanel #removeButton": {
                click: this.remove
            },
            "#cboGroup": {
                select: this.onCboGroupSelect,
                change: this.onCboGroupChange
            }
        });
    },

    clone: function(o) {
        var me = this;
        if(!o || 'object' !== typeof o) {
            return o;
        }
        var c = 'function' === typeof o.pop ? [] : {};
        var p, v;
        for(p in o) {
            if(o.hasOwnProperty(p)) {
                v = o[p];
                if(v && 'object' === typeof v) {
                    c[p] = me.clone(v);
                }
                else {
                    c[p] = v;
                }
            }
        }
        return c;
    },

    sendRequest: function(service, target) {
        var me = this;

        var dataService = {
            id: service.data.id,
            url: service.data.url,
            method: service.data.method
        };
        var taskStore = me.getTasksStore();
        var record = taskStore.findRecord('id',dataService.id);
        record.set('icon','loader.gif');

        //console.log('data',dataService);
        Ext.Ajax.request({
        //    url: 'http://10.50.24.160:3000/request',
            url: 'http://10.50.24.132:3000/request',
            params: dataService,
            method: 'post',
            //timeout: 5000,
            success: function(response) {
                //console.log('id',service.data.id);
                var resp = JSON.parse(response.responseText);
                //console.log(resp);
                if(resp.successfull){
                    record.set('state','success');
                    record.set('icon','success.png');
                }else{
                    record.set('state','fail');
                    record.set('icon','fail.png');
                }
                record.set('response',me.syntaxHighlight(resp.response));
                record.set('result',resp.result);
            },
            failure: function(response){
                //console.log('id',service.data.id);
                record.set('state','fail');
                record.set('icon','fail.png');
                console.log(arguments);
                record.set('response', '');
                record.set('result','timeOut');
            }
        });
    },

    syntaxHighlight: function(json) {
        if (typeof json == 'string') {
            //console.log(json);
            try{
                json = JSON.parse(json);
            }catch(e){
                return json;
            }

        }
        json = JSON.stringify(json, null, 2);
        return json;
    },

    loadPings: function(idService, scopeIn, lastHour) {
        var me = this;
        var chart = Ext.getCmp('chartStatus');
        var lastHour = (lastHour)? '&lastHour=' + lastHour:'';
        Ext.Ajax.request({
            method : 'GET',
            url : 'http://10.50.24.132:3000/pings?id=' + idService + lastHour,
            success : function(response){
                var data = Ext.JSON.decode(response.responseText);
                var idx = 0;
                var objService = me.dataPings[idx];
                var markerIndex = chart.markerIndex || 0;
                var timeAxis = chart.axes.get(1);
                var series = chart.series.get(0);
                series.markerConfig.fill = (data[0].status === 0)?'#14A525':'#f00';
                if(scopeIn === 0){
                    me.dataPings[idx].pings = (data);
                    var dateCurrent = new Date(data[0].ping_date);
                    timeAxis.fromDate = dateCurrent;
                    timeAxis.toDate = Ext.Date.add(dateCurrent, Ext.Date.HOUR, 1);
                }else{
                    if(me.dataPings[idx].pings[me.dataPings[idx].pings.length-1].id!==data[0].id)
                    me.dataPings[idx].pings.push(data[0]);
                }
                if(Ext.Date.format(timeAxis.toDate, 'Y-m-d H:i:s') < data[0].ping_date){
                    markerIndex = 1;
                    timeAxis.toDate = new Date(data[0].ping_date);
                    timeAxis.fromDate = new Date(objService.pings[me.indexPing].ping_date);
                    me.indexPing ++;
                    chart.markerIndex = markerIndex;
                }

                var pingStore = me.getPingStoreStore();

                pingStore.loadData(objService.pings);
            }
        });
    },

    searchServiceInPings: function(idService) {
        var ix = 0;
        Ext.Array.each(this.dataPings, function(obj){
            if(obj.id == idService){
                return false;
            }
            ix++;
        });

        return ix;
    },

    filterByGroupName: function(taskStore) {
        var comboValues = Ext.ComponentQuery.query('#cboGroup')[0].value; // Getting combo values from comboGroup

        if(comboValues!== null && comboValues.length > 0 && comboValues[0]!=='Filter by Group'){
            taskStore.clearFilter();
            taskStore.filterBy(function (record) {
                var result = false;
                result = Ext.Array.contains(comboValues,record.data.group); // Verifying if exits group within selected values from ComboBox
                if(result){
                    return record;
                }
            });
        }
    }

});
