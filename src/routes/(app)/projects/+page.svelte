<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { FolderKanban, Plus, SquareCheck, Square, Trash2, Pencil, X, Check } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();

	// Local state for optimistic updates
	let projects = $state<any[]>([]);
	projects = data.projects;
	let editingTodoId = $state<string | null>(null);
	let editingValue = $state('');

	let editingProjectId = $state<string | null>(null);
	let projectTitleValue = $state('');
	let projectDescValue = $state('');
	let projectStatusValue = $state('');

	// Sync local state when data changes (e.g. after form actions succeed and invalidate runs)
	$effect(() => {
		projects = data.projects;
	});

	function handleToggleOptimistic(projectId: string, todoId: string, currentStatus: boolean) {
		const pIdx = projects.findIndex((p: any) => p.id === projectId);
		if (pIdx !== -1) {
			const tIdx = projects[pIdx].todos.findIndex((t: any) => t.id === todoId);
			if (tIdx !== -1) {
				projects[pIdx].todos[tIdx].is_completed = !currentStatus;
			}
		}
	}

	function startEditing(id: string, value: string) {
		editingTodoId = id;
		editingValue = value;
	}

	function cancelEditing() {
		editingTodoId = null;
		editingValue = '';
	}

	function startEditingProject(project: any) {
		editingProjectId = project.id;
		projectTitleValue = project.title;
		projectDescValue = project.description || '';
		projectStatusValue = project.status;
	}

	function cancelEditingProject() {
		editingProjectId = null;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-semibold tracking-tight text-stone-900">Projects</h1>
			<p class="text-stone-500 mt-1">Plan and execute cabin improvements.</p>
		</div>
		<div class="p-3 bg-forest-100 text-forest-700 rounded-full hidden sm:block">
			<FolderKanban class="w-6 h-6" />
		</div>
	</div>

	<Card class="bg-stone-50/50">
		{#snippet content()}
			<form method="POST" action="?/addProject" use:enhance class="flex flex-col sm:flex-row gap-4 mt-4">
				<Input name="title" placeholder="New Project Title" required class="flex-1" />
				<Input name="description" placeholder="Description (optional)" class="flex-1" />
				<Button type="submit" class="bg-forest-700 hover:bg-forest-800"><Plus class="w-4 h-4 mr-2" /> Create</Button>
			</form>
		{/snippet}
	</Card>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{#each projects as project}
			<Card>
				{#snippet header()}
					<div class="flex justify-between items-start">
						{#if editingProjectId === project.id}
							<form method="POST" action="?/updateProject" use:enhance={() => {
								cancelEditingProject();
								return async ({ update }) => { await update({ reset: false }); };
							}} class="flex-1 space-y-4 pr-4">
								<input type="hidden" name="id" value={project.id} />
								<div class="space-y-2">
									<label for="project-title-{project.id}" class="text-xs font-medium text-stone-500">Title</label>
									<Input id="project-title-{project.id}" name="title" bind:value={projectTitleValue} class="h-8" required />
								</div>
								<div class="space-y-2">
									<label for="project-desc-{project.id}" class="text-xs font-medium text-stone-500">Description</label>
									<Input id="project-desc-{project.id}" name="description" bind:value={projectDescValue} class="h-8" />
								</div>
								<div class="space-y-2">
									<label for="project-status-{project.id}" class="text-xs font-medium text-stone-500">Status</label>
									<select id="project-status-{project.id}" name="status" bind:value={projectStatusValue} class="flex h-8 w-full rounded-md border border-stone-200 bg-white px-3 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2">
										<option value="planned">Planned</option>
										<option value="in-progress">In Progress</option>
										<option value="completed">Completed</option>
									</select>
								</div>
								<div class="flex gap-2">
									<Button type="submit" size="sm" class="h-8">Save Changes</Button>
									<Button type="button" size="sm" variant="ghost" class="h-8" onclick={cancelEditingProject}>Cancel</Button>
								</div>
							</form>
						{:else}
							<div class="flex-1 pr-4">
								<h3 class="font-semibold text-lg">{project.title}</h3>
								{#if project.description}
									<p class="text-stone-500 text-sm mt-1">{project.description}</p>
								{/if}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2
									{project.status === 'completed' ? 'bg-green-100 text-green-800' : 
									project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'}">
									{project.status.replace('-', ' ')}
								</span>
							</div>
						{/if}
						<div class="flex items-center gap-1">
							<button 
								class="p-2 text-stone-400 hover:text-stone-900 transition-colors"
								onclick={() => startEditingProject(project)}
							>
								<Pencil class="w-4 h-4" />
							</button>
							<form method="POST" action="?/deleteProject" use:enhance>
								<input type="hidden" name="id" value={project.id} />
								<button type="submit" class="p-2 text-stone-400 hover:text-red-600 transition-colors" onclick={(e) => !confirm('Are you sure you want to delete this project and all its tasks?') && e.preventDefault()}>
									<Trash2 class="w-4 h-4" />
								</button>
							</form>
						</div>
					</div>
				{/snippet}
				
				{#snippet content()}
					<div class="space-y-3 mt-4">
						<h4 class="text-sm font-medium text-stone-900">Tasks</h4>
						
						{#if project.todos.length === 0}
							<p class="text-sm text-stone-500 italic">No tasks added yet.</p>
						{/if}

						<ul class="space-y-2">
							{#each [...project.todos].sort((a: any, b: any) => (a.is_completed === b.is_completed ? 0 : a.is_completed ? 1 : -1)) as todo}
								<li class="flex items-center gap-3 group">
									{#if editingTodoId === todo.id}
										<form method="POST" action="?/updateTodo" use:enhance={() => {
											cancelEditing();
											return async ({ update }) => { await update({ reset: false }); };
										}} class="flex-1 flex items-center gap-2">
											<input type="hidden" name="id" value={todo.id} />
											<Input name="task" bind:value={editingValue} class="h-8 text-sm" autofocus />
											<Button type="submit" size="icon" variant="ghost" class="h-8 w-8 text-forest-600">
												<Check class="w-4 h-4" />
											</Button>
											<Button type="button" size="icon" variant="ghost" class="h-8 w-8 text-stone-400" onclick={cancelEditing}>
												<X class="w-4 h-4" />
											</Button>
										</form>
									{:else}
										<form method="POST" action="?/toggleTodo" use:enhance={() => {
											handleToggleOptimistic(project.id, todo.id, todo.is_completed);
											return async ({ update }) => { await update({ reset: false }); };
										}}>
											<input type="hidden" name="id" value={todo.id} />
											<input type="hidden" name="is_completed" value={(!todo.is_completed).toString()} />
											<button type="submit" class="text-stone-400 hover:text-forest-600 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 rounded-md">
												{#if todo.is_completed}
													<SquareCheck class="w-5 h-5 text-forest-600" />
												{:else}
													<Square class="w-5 h-5" />
												{/if}
											</button>
										</form>
										<span class="text-sm flex-1 transition-all {todo.is_completed ? 'line-through text-stone-400' : 'text-stone-700'}">
											{todo.task}
										</span>
										<div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
											<button 
												class="p-1 text-stone-400 hover:text-stone-900 transition-colors"
												onclick={() => startEditing(todo.id, todo.task)}
											>
												<Pencil class="w-3.5 h-3.5" />
											</button>
											<form method="POST" action="?/deleteTodo" use:enhance>
												<input type="hidden" name="id" value={todo.id} />
												<button type="submit" class="p-1 text-stone-400 hover:text-red-600 transition-colors">
													<Trash2 class="w-3.5 h-3.5" />
												</button>
											</form>
										</div>
									{/if}
								</li>
							{/each}
						</ul>

						<form method="POST" action="?/addTodo" use:enhance class="flex gap-2 mt-4 pt-4 border-t border-stone-100">
							<input type="hidden" name="project_id" value={project.id} />
							<Input name="task" placeholder="Add a new task..." class="h-8 text-sm" required />
							<Button type="submit" size="sm" variant="secondary" class="h-8">Add</Button>
						</form>
					</div>
				{/snippet}
			</Card>
		{/each}

		{#if projects.length === 0}
			<div class="col-span-full py-12 text-center text-stone-500 bg-white rounded-xl border border-stone-200 border-dashed">
				<FolderKanban class="w-12 h-12 mx-auto text-stone-300 mb-3" />
				<p>No projects found. Create your first project to get started.</p>
			</div>
		{/if}
	</div>
</div>
