# Course Form Schema Usage

This document shows how to use the CourseFormSchema with the image upload feature.

## Basic Usage

```svelte
<script lang="ts">
  import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
  import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';
  import type { CourseCategory } from '$lib/types/entities/CourseCategory';
  import type { User } from '$lib/types/entities/User';

  // Sample data (fetch from your API)
  let categories: CourseCategory[] = [
    { id: '1', name: 'Web Development', slug: 'web-dev' },
    { id: '2', name: 'Mobile Development', slug: 'mobile-dev' }
  ];

  let users: User[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
  ];

  // Create the form schema
  const schema = CourseFormPresets.standard(categories, users);

  // Handle form submission
  async function handleSubmit(data: any) {
    console.log('Course data:', data);
    // The imageUrl field will contain a base64 data URL of the uploaded image
    // You can upload this to your server or cloud storage

    // Example: Extract and upload image
    if (data.imageUrl) {
      // Convert base64 to blob and upload
      const blob = await fetch(data.imageUrl).then(r => r.blob());
      // Upload blob to your storage service
    }
  }
</script>

<UniversalForm
  {schema}
  callbacks={{ onSubmit: handleSubmit }}
/>
```

## Image Upload Field

The image upload field has been added with the following configuration:

```typescript
{
  name: 'imageUrl',
  label: 'Course Image',
  type: 'image-upload',
  group: 'basic',
  variants: { standard: true, detailed: true, edit: true, embedded: true },
  required: false,
  placeholder: 'Upload course image...',
  helpText: 'Upload a cover image for the course (max 5MB)',
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024, // 5MB
  previewWidth: 200,
  previewHeight: 200,
  colSpan: 2
}
```

## Features

- **Drag & Drop Support**: Users can drag and drop images onto the upload area
- **File Validation**: Validates file type and size before upload
- **Image Preview**: Shows a preview of the uploaded image
- **Progress Indicator**: Displays upload progress
- **Error Handling**: Shows validation errors with clear messaging
- **Responsive Design**: Works well on all screen sizes

## Edit Form

To use the edit form variant:

```svelte
<script lang="ts">
  import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';

  const schema = CourseFormPresets.edit(categories, users);

  const initialData = {
    name: 'Existing Course',
    imageUrl: 'https://example.com/image.jpg', // Can be a URL or base64
    price: 999,
    ownerId: '1',
    status: 'PUBLISHED',
    categoryIds: ['1', '2'],
    labels: ['frontend', 'react'],
    isFeatured: true
  };
</script>

<UniversalForm
  {schema}
  {initialData}
  callbacks={{ onSubmit: handleSubmit }}
/>
```

## Embedded Form

For a compact version without header:

```svelte
<script lang="ts">
  const schema = CourseFormPresets.embedded(categories, users);
</script>

<UniversalForm {schema} callbacks={{ onSubmit: handleSubmit }} />
```
