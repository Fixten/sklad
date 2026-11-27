# Product Template Management

## Purpose

The user maintains Product Templates: reusable definitions of a product. A template says what the product is, how it is made, which Material Variants it needs and in what default quantities, and how many production hours it is expected to take. Templates are created and maintained here. Producing Product Items from them is covered later.

## User flow

1. The Product Templates page is the list. Its unit is the template card.
2. The user finds the template with the search box, which matches names, descriptions, and Material Variant, Material, and Type names.
3. The user opens the template's page. It shows all of the template's fields and its Material Variants.
4. The user edits the template on its page, or deletes it after confirming.
5. To make a similar product, the user duplicates a template and changes what differs, or adds a new template from the list.
6. The user can reveal hidden templates and restore them.
7. The user returns to the list when done.

## Behavior

### List

- The list shows templates as cards. A card opens its page when selected.
- A card shows the name, the description, a summary of the required Material Variants, and the expected production hours.
- The summary lists the first three Material Variant names, followed by «и ещё N» when there are more. A template with no Material Variants shows no summary.
- Expected production hours show «не указано» when they are absent.
- The search box filters the cards by the template's name and description, and by the names of its Material Variants, their Materials, and their Types. It does not create anything.
- While loading, the list shows a loading state.
- If the list fails to load, it shows «Не удалось загрузить данные».
- The list offers «Добавить шаблон». When no templates exist, it shows «Шаблонов пока нет» with the same action.
- When search or filters leave no matching templates, it shows «Ничего не найдено». Enabling «Показать скрытые» adds hidden templates without hiding active templates.
- Hidden templates are not listed unless the user turns on «Показать скрытые». Then they are listed and marked «Скрыто».

### Template page

- The page is where the user views and edits everything about a template.
- It shows: name, description, production instructions, drawing description, expected production hours, development hours, and Material Variants.
- Each Material Variant row shows its name, with its Material as context, and its quantity with the Material Variant's unit.
- Development hours are shown with a note that they are informational and are not included in the cost of a Product Item.
- Absent expected production or development hours show «не указано».
- A template with no Material Variants shows that none have been added and offers «Добавить материал» in the editor.
- A visible template offers «Редактировать», «Дублировать», and «Удалить».
- A hidden template offers only «Переименовать» and «Восстановить».
- If a template URL is unknown or the template has been hard-deleted, the page shows «Запись не найдена».

### Fields

- «Название» is required.
- «Описание», «Инструкция по производству», and «Описание чертежа» are optional text.
- «Ожидаемые часы производства» and «Часы разработки» are optional. When filled, they accept up to three decimal places and cannot be negative. Zero is allowed. Clearing a field makes the hours absent.
- «Материалы» is optional. A template may be saved with no Material Variants.

### Material Variants

- The «Материалы» section contains rows labeled «Вариант» and «Количество». «Добавить материал» adds a row; each row can be removed.
- The user chooses from active Material Variants. Hidden Material Variants are not offered for new rows.
- An active Material Variant remains selectable when its Material or Type is hidden. Restoring that variant does not restore its hidden parents.
- A Material Variant that is already in another row is not offered again. A Material Variant appears at most once in a template.
- The unit is never entered. Once a Material Variant is chosen, the quantity shows that Material Variant's unit: «шт» or «м».
- Pieces take whole numbers. Meters take up to three decimal places.
- The quantity must be greater than zero.
- A half-filled row blocks saving and is not silently dropped.
- If a Material Variant is hidden after being added, its existing row stays visible by name and is marked «Скрыто».
- Create and full-edit saves send the full «Материалы» array and are rejected while a hidden Material Variant row remains, even when the user changes only another field. The row must be removed or the Material Variant restored before saving. A hidden template's name-only rename does not send materials and remains allowed.

### Validation and save messages

- Missing or invalid values and server rejections do not save the template; the entered values stay.
- Missing name: «Укажите название».
- Name held by an active template: «Такое имя уже занято.»
- Name held by a hidden template: «Скрыто, восстановите, чтобы продолжить.»
- Hidden Material Variant on save: «Скрыто, восстановите, чтобы продолжить.»; the row remains visible and is marked «Скрыто».
- Duplicate Material Variant rejected by the server: «Этот вариант уже добавлен.»
- Missing or non-positive quantity: «Укажите количество».
- Fractional piece quantity: «Количество в штуках должно быть целым».
- Meter quantity or hours with more than three decimal places: «Не больше трёх знаков после запятой».
- Negative hours: «Часы не могут быть отрицательными».
- Other save failure: «Не удалось сохранить».

### Creating

- The user adds a template from the list with «Добавить шаблон». The form asks for the fields listed above.
- Only the name is required. The template can be saved with no Material Variants.
- Saving shows «Шаблон создан» and opens the new template's page.
- Cancelling discards what was entered.

### Editing

- Editing happens on the template's page, not in the list.
- The user can change any field and the Material Variants.
- Changes affect future Product Items only. Existing Product Items keep their own values and are not changed by later template edits.
- Saving with missing or invalid values shows the problem on the form and does not save. The entered values stay.
- Saving shows «Шаблон сохранён», and the template's page shows the saved values.
- Cancelling discards changes.

### Duplicating

- «Дублировать» is available from a visible template's card and from its page. Hidden templates cannot be duplicated.
- It opens the create form prefilled with all of the source template's values, including its Material Variant rows. The name is the source name followed by « (копия)».
- Nothing is created until the user saves. Cancelling leaves the source template unchanged.
- Saving creates a new template, shows «Шаблон создан», and opens its page. The copy and its source are independent afterwards.

### Deleting

- A delete action is available on the card in the list and on the template's page.
- The user confirms in a Dialog titled «Удалить шаблон?». Its description is «Если шаблон используется изделиями, он будет скрыт, а не удалён.» The destructive action is «Удалить», and the mandatory footer dismissal is «Закрыть». Cancelling leaves the template unchanged.
- After a successful delete, the user returns to the list.
- A template that no Product Item refers to is removed permanently and shows «Удалено».
- A template that Product Items refer to is hidden instead. Its toast title is «Скрыто» and its description is «Шаблон скрыт: его используют изделия. Его можно восстановить.»
- If deletion fails, it shows «Не удалось удалить шаблон».

### Hidden templates

- «Показать скрытые» reveals hidden cards in the list, marked «Скрыто».
- A hidden card offers restore in the list.
- A hidden template's page offers rename and restore only. A hidden template cannot be given new Material Variants or be duplicated.
- A hidden template's current name is reserved. Creating or renaming a template to that name is rejected with «Скрыто, восстановите, чтобы продолжить.» The user restores it, using «Показать скрытые», or picks another name.
- Renaming a hidden template frees its old name and shows «Шаблон сохранён».
- Restoring makes the template a normal template again and shows «Восстановлено». Restoring never fails on the name, because the name stayed reserved while the template was hidden. If restoring fails, it shows «Не удалось восстановить шаблон».

## Important cases

- No Material Variants: the user saves the template with only a name and adds Material Variants later.
- A similar product needs a different Material Variant: the user duplicates the template, changes the row, and saves; the source is unchanged.
- The user knows a Material Variant but not the template: searching by its name finds the template, even when it is outside the card's first three Material Variants.
- A Material Variant is later hidden: its row stays visible by name and marked «Скрыто». Create and full-edit saves send the full «Материалы» array and are rejected while that row remains; the row must be removed or the Material Variant restored before saving. A hidden template's name-only rename does not send materials and remains allowed.
- A name is held by a hidden template: the user restores it or renames it to free the old name, then reuses that name.
- An active template already has the name: the duplicate is not saved, and the user renames it.
- Expected production hours are absent: the card shows «не указано». If either hours field is absent, the page shows «не указано» for it; the editor field is empty.
- A template with Product Items is edited: the edit affects only future Product Items.
- Quantity is missing, non-positive, fractional for pieces, or over three decimal places for meters: saving is blocked and the entered value stays.

## Out of scope

- Product Items: creating, viewing, editing, and their status, sales, and history.
- Batch production.
- Labor cost setting, and any cost display or cost estimate for a template.
- Material stock, inventory, supply consumption, and production usage.
- Drawing files and images. Only the drawing description is in scope.
- Template versions and change history.
