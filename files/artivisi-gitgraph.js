window.onload = function(e){
  var graphConfig = new GitGraph.Template({
      colors: [ "#9993FF", "#47E8D4", "#6BDB52", "#F85BB5", "#FFA657", "#F85BB5" ],
      branch: {
        showLabel: true, // display branch names on graph
        labelFont: "normal 10pt Arial",
        labelRotation: 0
      },
      commit: {
        spacingY: -50,
        spacingX: 100,
        dot: {
          size: 8,
          strokeColor: "#000000",
          strokeWidth: 4
        },
        tag: {
          font: "normal 10pt Arial",
          color: "yellow"
        },
        message: {
          color: "black",
          font: "normal 12pt Arial",
          displayAuthor: false,
          displayBranch: false,
          displayHash: false,
        }
      },
      arrow: {
        size: 8,
        offset: 3
      }
    });

    var gitgraph = new GitGraph({
      elementId: "gitGraphHorizontal",
      template: graphConfig,
      author: "Endy Muhardin <endy@muhardin.com>",
      mode: "extended",
      orientation: "horizontal"
    });

    var master = gitgraph.branch("master");
    master.commit("commit pertama");

    var fitur1 = master.branch("fitur1");
    var fitur2 = master.branch("fitur2");

    fitur1.commit("ui mockup").commit("akses database").commit("validasi");
    fitur1.merge(master);

    var fitur3 = master.branch("fitur3");

    fitur2.commit("ui mockup").commit("akses database").commit("validasi");
    fitur2.merge(master);

    var fitur4 = master.branch("fitur4");

    master.commit({
      message: "Rilis development #1",
      tag: "1.0.0-M.001"
    });

    fitur3.commit("ui mockup").commit("akses database").commit("validasi");
    fitur3.merge(master);

    master.commit({
      message: "Rilis testing #1",
      tag: ["1.0.0-RC.001"]
    });

    fitur4.commit("ui mockup").commit("akses database").commit("validasi");
    fitur4.merge(master);

    master.commit({
      message: "Rilis ke production",
      tag: "1.0.0-RELEASE"
    });

    var maint1x = master.branch({
        name: "1.x"
    });

    master.commit("fitur #5").commit("fitur #6");
    master.commit({ message : "Development release pertama versi 2.0.0", tag: "2.0.0-M.001"});

    maint1x.commit({ message : "fix #1", tag: "1.0.1-RELEASE"});
    maint1x.merge(master, {message : "merge fix #1"});

    master.commit("fitur #7").commit("fitur #8");
    master.commit({ message : "Persiapan rilis versi 2", tag: "2.0.0-RC.001"});

    maint1x.commit({ message : "fix #2", tag: "1.0.2-RELEASE"});
    maint1x.merge(master, {message : "merge fix #2"});

    master.commit("fitur #9").commit("fitur #10");

    var gitgraphVertical = new GitGraph({
      elementId: "gitGraphVertical",
      template: "metro",
      author: "Endy Muhardin <endy@muhardin.com>"
    });

    var masterVertical = gitgraphVertical.branch("master");
    masterVertical.commit("commit pertama");

    var fitur1Vertical = masterVertical.branch("fitur1");
    var fitur2Vertical = masterVertical.branch("fitur2");

    fitur1Vertical.commit("ui mockup").commit("akses database").commit("validasi");
    fitur1Vertical.merge(masterVertical);

    var fitur3Vertical = masterVertical.branch("fitur3");

    fitur2Vertical.commit("ui mockup").commit("akses database").commit("validasi");
    fitur2Vertical.merge(masterVertical);

    var fitur4Vertical = masterVertical.branch("fitur4");

    masterVertical.commit({
      message: "Rilis development #1",
      tag: "1.0.0-M.001"
    });

    fitur3Vertical.commit("ui mockup").commit("akses database").commit("validasi");
    fitur3Vertical.merge(masterVertical);

    masterVertical.commit({
      message: "Rilis testing #1",
      tag: ["1.0.0-RC.001"]
    });

    fitur4Vertical.commit("ui mockup").commit("akses database").commit("validasi");
    fitur4Vertical.merge(masterVertical);

    masterVertical.commit({
      message: "Rilis ke production",
      tag: "1.0.0-RELEASE"
    });

    var maint1xVertical = masterVertical.branch({
        name: "1.x"
    });

    masterVertical.commit("fitur #5").commit("fitur #6");
    masterVertical.commit({ message : "Development release pertama versi 2.0.0", tag: "2.0.0-M.001"});

    maint1xVertical.commit({ message : "fix #1", tag: "1.0.1-RELEASE"});
    maint1xVertical.merge(masterVertical, {message : "merge fix #1"});

    masterVertical.commit("fitur #7").commit("fitur #8");
    masterVertical.commit({ message : "Persiapan rilis versi 2", tag: "2.0.0-RC.001"});

    maint1xVertical.commit({ message : "fix #2", tag: "1.0.2-RELEASE"});
    maint1xVertical.merge(masterVertical, {message : "merge fix #2"});

    masterVertical.commit("fitur #9").commit("fitur #10");
}
