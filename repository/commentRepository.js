export class CommentRepository {
  baseUrl = 'https://localhost:44313/api/Comments'

    async addComment(comment){
    const data = await $fetch(`${this.baseUrl}`, {
      method: 'POST',
      body: {
        content : comment.content,
        createdAt : comment.createdAt,
        modifiedAt : comment.modifiedAt,
        taskId : comment.taskId,
      }
    })
    return data
  }
}

