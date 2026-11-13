import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const GET: APIRoute = async () => {
  const modules = await getCollection('modules');
  const index = modules
    .sort((a, b) => a.data.number - b.data.number)
    .map((m) => {
      const tools = m.data.tools.map((t) => t.name).join(' ');
      const objectives = m.data.objectives.join(' ');
      const haystack = [
        m.data.number,
        m.data.title,
        m.data.summary,
        m.data.category,
        tools,
        objectives,
        m.body,
      ]
        .join(' ')
        .toLowerCase();
      return {
        number: m.data.number,
        title: m.data.title,
        summary: m.data.summary,
        category: m.data.category,
        url: `${base}/modules/${m.slug}`,
        haystack,
      };
    });

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
