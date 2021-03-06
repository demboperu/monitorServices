/*
 * File: app/view/MainView.js
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

Ext.define('monitor.view.MainView', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Ext.XTemplate',
        'Ext.grid.plugin.RowEditing',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Time',
        'Ext.chart.series.Line',
        'Ext.chart.axis.Category'
    ],

    id: 'mainView',
    layout: {
        type: 'fit'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    itemId: 'mainPanel',
                    resizable: false,
                    layout: {
                        type: 'border'
                    },
                    collapsed: false,
                    manageHeight: false,
                    title: 'My Tasks',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            itemId: 'mainToolbar',
                            items: [
                                {
                                    xtype: 'label'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'addButton',
                                    icon: 'resources/images/add.png',
                                    text: 'Add Task'
                                },
                                {
                                    xtype: 'combobox',
                                    itemId: 'cboGroup',
                                    fieldLabel: 'Filter by Group',
                                    hideLabel: true,
                                    value: 'Filter by Group',
                                    editable: false,
                                    displayField: 'groupName',
                                    multiSelect: true,
                                    store: 'Groups'
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'gridpanel',
                            collapseMode: 'mini',
                            flex: 1,
                            region: 'west',
                            split: true,
                            border: '2 2 2 2',
                            id: '',
                            itemId: 'gridPanel',
                            width: 100,
                            resizable: false,
                            bodyBorder: true,
                            forceFit: true,
                            store: 'Tasks',
                            columns: [
                                {
                                    xtype: 'templatecolumn',
                                    tpl: [
                                        '<span style="font-size: 1.1em; font-weight: bold">{name}</span>'
                                    ],
                                    text: 'Task',
                                    flex: 1,
                                    editor: {
                                        xtype: 'textfield',
                                        name: 'name'
                                    }
                                },
                                {
                                    xtype: 'templatecolumn',
                                    tpl: [
                                        '<table>',
                                        '    <tr>',
                                        '        <td style="padding-right: 8px">',
                                        '            <img src="resources/images/{icon}" title="{state} Priority" />',
                                        '        </td>',
                                        '    	<td>',
                                        '            {state}',
                                        '        </td>',
                                        '    </tr>',
                                        '</table>'
                                    ],
                                    text: 'State',
                                    flex: 1,
                                    editor: {
                                        xtype: 'combobox',
                                        name: 'priority',
                                        emptyText: 'Select Priority',
                                        editable: false,
                                        displayField: 'priority',
                                        store: 'Priorities',
                                        valueField: 'priority'
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'build_number',
                                    text: 'Build Number'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'group',
                                    text: 'Group',
                                    flex: 1
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'url',
                                    text: 'URL',
                                    flex: 3
                                }
                            ],
                            plugins: [
                                Ext.create('Ext.grid.plugin.RowEditing', {

                                })
                            ]
                        },
                        {
                            xtype: 'panel',
                            collapseMode: 'header',
                            region: 'center',
                            border: '2 2 2 2',
                            data: {
                                
                            },
                            itemId: 'detailsPanel1',
                            autoScroll: true,
                            resizable: false,
                            layout: {
                                type: 'fit'
                            },
                            bodyBorder: true,
                            bodyPadding: '10 10 10 10',
                            collapseFirst: false,
                            collapsible: false,
                            manageHeight: false,
                            items: [
                                {
                                    xtype: 'tabpanel',
                                    width: 400,
                                    anchorSize: 100,
                                    activeTab: 0,
                                    items: [
                                        {
                                            xtype: 'panel',
                                            layout: {
                                                type: 'fit'
                                            },
                                            title: 'Status History',
                                            items: [
                                                {
                                                    xtype: 'chart',
                                                    height: 250,
                                                    id: 'chartStatus',
                                                    width: 400,
                                                    shadow: false,
                                                    animate: true,
                                                    insetPadding: 20,
                                                    store: 'PingStore',
                                                    axes: [
                                                        {
                                                            type: 'Numeric',
                                                            fields: [
                                                                'status'
                                                            ],
                                                            label: {
                                                                0: 'sss',
                                                                2: 'fff'
                                                            },
                                                            grid: {
                                                                odd: {
                                                                    fill: '#dedede',
                                                                    stroke: '#ddd',
                                                                    'stroke-width': 0.2
                                                                }
                                                            },
                                                            title: 'Status',
                                                            maximum: 5,
                                                            minimum: -3,
                                                            position: 'left'
                                                        },
                                                        {
                                                            type: 'Time',
                                                            fields: [
                                                                'ping_date'
                                                            ],
                                                            grid: true,
                                                            position: 'bottom',
                                                            title: 'Date',
                                                            constrain: true,
                                                            dateFormat: 'H:i:s'
                                                        }
                                                    ],
                                                    series: [
                                                        {
                                                            type: 'line',
                                                            label: {
                                                                display: 'none',
                                                                field: 'ping_date',
                                                                renderer: function(v) { return v >> 0; },
                                                                'text-anchor': 'middle'
                                                            },
                                                            axis: [
                                                                'left',
                                                                'bottom'
                                                            ],
                                                            xField: 'ping_date',
                                                            yField: 'status',
                                                            markerConfig: {
                                                                radius: 3,
                                                                size: 3,
                                                                fill: '#f00'
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'panel',
                                            title: 'Response from server',
                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    border: '2 2 2 2',
                                                    data: {
                                                        
                                                    },
                                                    itemId: 'detailsPanel',
                                                    tpl: [
                                                        '<h1>{name}</h1>',
                                                        '<h2>{result}</h2>',
                                                        '<pre>',
                                                        '<code>',
                                                        '{response}',
                                                        '</code>',
                                                        '</pre>',
                                                        '',
                                                        ''
                                                    ],
                                                    autoScroll: true,
                                                    resizable: false,
                                                    layout: {
                                                        type: 'fit'
                                                    },
                                                    bodyBorder: true,
                                                    bodyPadding: '10 10 10 10',
                                                    manageHeight: false
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'panel',
                                            title: 'Status history 2',
                                            dockedItems: [
                                                {
                                                    xtype: 'chart',
                                                    dock: 'top',
                                                    height: 272,
                                                    width: 400,
                                                    shadow: false,
                                                    animate: true,
                                                    insetPadding: 5,
                                                    store: 'PingStore',
                                                    axes: [
                                                        {
                                                            type: 'Category',
                                                            fields: [
                                                                'ping_date'
                                                            ],
                                                            title: 'Date',
                                                            position: 'bottom'
                                                        },
                                                        {
                                                            type: 'Numeric',
                                                            dashSize: 2,
                                                            title: 'Status',
                                                            constrain: false,
                                                            decimals: 0,
                                                            maximum: 6,
                                                            minimum: 0,
                                                            position: 'left'
                                                        }
                                                    ],
                                                    series: [
                                                        {
                                                            type: 'line',
                                                            title: 'aaa',
                                                            xField: 'ping_date',
                                                            yField: 'status',
                                                            markerConfig: {
                                                                
                                                            },
                                                            smooth: 2
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});