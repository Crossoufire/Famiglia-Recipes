import {join} from "path";
import {eq} from "drizzle-orm";
import {readFileSync} from "node:fs";
import {db} from "~/lib/server/database/db";
import {label as labelTable} from "~/lib/server/database/schema";


export const seedLabels = async () => {
    const labelsFilePath = join(process.cwd(), "public", "static", "labels.json");

    const fileContent = readFileSync(labelsFilePath, "utf-8");
    const jsonLabels: { name: string; color: string; order: number }[] = JSON.parse(fileContent);

    for (const label of jsonLabels) {
        const existingLabel = await db.select().from(labelTable).where(eq(labelTable.name, label.name)).limit(1);

        if (existingLabel.length === 0) {
            await db.insert(labelTable).values({
                name: label.name,
                color: label.color,
                order: label.order,
            });
        }
        else {
            await db.update(labelTable)
                .set({ color: label.color, order: label.order })
                .where(eq(labelTable.name, label.name));
        }
    }
}
