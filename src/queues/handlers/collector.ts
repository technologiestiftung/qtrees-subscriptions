// creates connection to trees db and gets all

import { Job } from "bullmq";
import { ScheduleJobReturnType } from "./schedule.js";
import sql from "../../db.js";

// states of trees in subscriptions
const handler = async (job: Job<Record<string, ScheduleJobReturnType[]>>) => {
  try {
    // ids should be all the same since a job is created on a user basis
    // const ids = job.data.subscriptions.map((sub) => sub.id);
    // console.log(job.name, job.data);
    for (const sub of job.data.subscriptions) {
      const geojson = sub.geojson as any;
      // console.log(firstGeom);
      const predictions = await sql`
      SELECT * FROM (SELECT
      trees.id, trees.geom AS tree_geom, pr.prediction, pr.tree_id
        FROM dummy_predictions pr
        JOIN dummy_trees trees
        ON pr.tree_id = trees.id) as pr_trees WHERE  ST_Intersects(pr_trees.tree_geom, ST_GeomFromGeoJSON(${geojson}))`;
      console.info(predictions);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { handler };
