import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {

   global.scene().addNode(new Gltf2Node({
      url: "./media/gltf/dungeon-large/dungeon-large.gltf"
   }));

   return {
      enableSceneReloading: true,
      scenes: [
         { name: "Game Demo", path: "./levelDemo.js" },
         { name: "Level 1", path: "./level1.js" },
         { name: "Level 2", path: "./level2.js" },
         { name: "Level 3", path: "./level3.js" },
         // { name: "Demo4D"        , path: "./demo4D.js"        },
         // { name: "DemoBlobs"     , path: "./demoBlobs.js"     },
         // { name: "DemoCube"      , path: "./demoCube.js"      },
         // { name: "DemoDots"      , path: "./demoDots.js"      },
         // { name: "DemoGLTF"      , path: "./demoGLTF.js"      },
         // { name: "DemoGreenThumb", path: "./demoGreenThumb.js"},
         // { name: "DemoHUD"       , path: "./demoHUD.js"       },
         // { name: "DemoLabel"     , path: "./demoLabel.js"     },
         // { name: "DemoNoisyCube" , path: "./demoNoisyCube.js" },
         // { name: "DemoZoom"      , path: "./demoZoom.js"      },
      ]
   };
}
